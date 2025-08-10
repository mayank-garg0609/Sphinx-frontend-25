// app/(auth)/utils/secureApiClient.tsx
import { SECURITY_CONFIG } from './security';
import { rateLimiter } from './validation';
import { tokenUtils } from './secureStorage';

/**
 * Generate CSRF token for request
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Enhanced request headers with security measures
 */
function createSecureHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...additionalHeaders,
  };
  
  // Add auth token if available
  const token = tokenUtils.getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add CSRF token
  const csrfToken = generateCSRFToken();
  headers['X-CSRF-Token'] = csrfToken;
  
  // Add request timestamp for replay attack prevention
  headers['X-Request-Time'] = Date.now().toString();
  
  return headers;
}

/**
 * Validate response for security issues
 */
function validateResponse(response: Response): void {
  // Check for security headers
  const securityHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
  ];
  
  securityHeaders.forEach(header => {
    if (!response.headers.get(header)) {
      console.warn(`Missing security header: ${header}`);
    }
  });
  
  // Validate content type
  const contentType = response.headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    throw new Error('Invalid response content type');
  }
}

/**
 * Secure exponential backoff for retries
 */
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Payload size validation and sanitization
 */
function validatePayload(data: any): void {
  const serialized = JSON.stringify(data);
  if (serialized.length > SECURITY_CONFIG.api.maxPayloadSize) {
    throw new Error('Request payload too large');
  }
  
  // Check for suspicious patterns in payload
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(serialized))) {
    throw new Error('Suspicious content detected in payload');
  }
}

/**
 * Secure API client with comprehensive security measures
 */
class SecureApiClient {
  private baseUrl: string;
  private requestId: number = 0;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  private getRequestIdentifier(endpoint: string, userIdentifier?: string): string {
    // Create identifier for rate limiting (IP simulation + endpoint)
    const identifier = userIdentifier || 'anonymous';
    return `${identifier}:${endpoint}`;
  }
  
  private async makeRequest(
    endpoint: string,
    options: RequestInit & { retryCount?: number; userIdentifier?: string } = {}
  ): Promise<Response> {
    const { retryCount = 0, userIdentifier, ...fetchOptions } = options;
    const requestId = ++this.requestId;
    
    console.log(`🔒 [${requestId}] Starting secure request to ${endpoint}`);
    
    // Rate limiting check
    const rateLimitId = this.getRequestIdentifier(endpoint, userIdentifier);
    if (rateLimiter.isBlocked(rateLimitId)) {
      const remainingTime = rateLimiter.getRemainingTime(rateLimitId);
      throw new Error(`Rate limited. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`);
    }
    
    // Record attempt for rate limiting
    const rateResult = rateLimiter.recordAttempt(rateLimitId);
    if (rateResult.blocked) {
      throw new Error(`Too many attempts. Blocked for ${Math.ceil(rateResult.blockDuration! / 1000)} seconds.`);
    }
    
    // Validate payload if present
    if (fetchOptions.body) {
      try {
        const payload = JSON.parse(fetchOptions.body as string);
        validatePayload(payload);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error('Invalid JSON payload');
        }
        throw error;
      }
    }
    
    // Create secure headers
    const headers = createSecureHeaders(fetchOptions.headers as Record<string, string>);
    
    // Setup request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, SECURITY_CONFIG.api.timeout);
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
        credentials: 'same-origin', // CSRF protection
        mode: 'cors',
        cache: 'no-store', // Prevent caching of sensitive data
      });
      
      clearTimeout(timeoutId);
      
      // Validate response security
      validateResponse(response);
      
      // Handle non-ok responses
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData;
        
        if (contentType?.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: 'Invalid error response format' };
          }
        } else {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        // Enhanced error for security context
        throw {
          response,
          data: errorData,
          security: {
            rateLimitRemaining: rateResult.remainingAttempts,
            requestId,
          }
        };
      }
      
      console.log(`✅ [${requestId}] Request successful`);
      return response;
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle network errors with retry logic
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      
      // Retry logic with exponential backoff
      if (retryCount < SECURITY_CONFIG.api.maxRetries && 
          !error.response && // Don't retry server errors
          error.name !== 'AbortError') {
        
        const backoffDelay = SECURITY_CONFIG.api.backoffMultiplier ** retryCount * 1000;
        console.log(`🔄 [${requestId}] Retrying in ${backoffDelay}ms (attempt ${retryCount + 1})`);
        
        await delay(backoffDelay);
        return this.makeRequest(endpoint, { ...options, retryCount: retryCount + 1 });
      }