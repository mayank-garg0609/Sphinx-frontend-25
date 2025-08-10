// app/(auth)/utils/sessionSecurity.tsx
import { SECURITY_CONFIG } from './security';
import { tokenUtils, userDataUtils } from './secureStorage';

/**
 * Session security manager with comprehensive protection
 */
class SessionSecurityManager {
  private sessionStartTime: number | null = null;
  private lastActivityTime: number | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private securityChecks: NodeJS.Timeout | null = null;
  private isDestroyed = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupEventListeners();
      this.startSecurityChecks();
    }
  }

  /**
   * Initialize session tracking
   */
  private initializeSession(): void {
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
    
    console.log('🔒 Session security initialized');
  }

  /**
   * Setup event listeners for activity tracking
   */
  private setupEventListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => this.recordActivity();
    
    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkSessionValidity();
      }
    });

    // Listen for storage changes (detect logout from other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'sphinx_secure_auth_token' && !e.newValue) {
        console.log('🔓 Logout detected from another tab');
        this.handleLogout('logout_other_tab');
      }
    });

    // Listen for beforeunload to cleanup
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Record user activity
   */
  private recordActivity(): void {
    if (this.isDestroyed) return;
    
    this.lastActivityTime = Date.now();
    
    // Reset activity timer
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    
    // Set timeout for inactivity
    this.activityTimer = setTimeout(() => {
      this.handleInactivity();
    }, SECURITY_CONFIG.session.maxAge);
  }

  /**
   * Start periodic security checks
   */
  private startSecurityChecks(): void {
    this.securityChecks = setInterval(() => {
      if (this.isDestroyed) return;
      
      this.checkSessionValidity();
      this.checkTokenExpiration();
      this.checkSessionDuration();
    }, 60000); // Check every minute
  }

  /**
   * Check overall session validity
   */
  private checkSessionValidity(): boolean {
    if (this.isDestroyed) return false;

    const token = tokenUtils.getAuthToken();
    const user = userDataUtils.getUserData();

    if (!token || !user) {
      console.log('🔓 Session invalid: Missing token or user data');
      this.handleLogout('missing_data');
      return false;
    }

    return true;
  }

  /**
   * Check token expiration
   */
  private checkTokenExpiration(): boolean {
    if (this.isDestroyed) return false;

    const token = tokenUtils.getAuthToken();
    if (!token) return false;

    if (tokenUtils.isTokenExpired(token)) {
      console.log('🔓 Session expired: Token expired');
      this.handleLogout('token_expired');
      return false;
    }

    return true;
  }

  /**
   * Check session duration limits
   */
  private checkSessionDuration(): boolean {
    if (this.isDestroyed || !this.sessionStartTime) return false;

    const sessionDuration = Date.now() - this.sessionStartTime;
    
    // Check absolute timeout
    if (sessionDuration > SECURITY_CONFIG.session.absoluteTimeout) {
      console.log('🔓 Session expired: Absolute timeout reached');
      this.handleLogout('absolute_timeout');
      return false;
    }

    // Check inactivity timeout
    if (this.lastActivityTime) {
      const inactiveDuration = Date.now() - this.lastActivityTime;
      if (inactiveDuration > SECURITY_CONFIG.session.maxAge) {
        console.log('🔓 Session expired: Inactivity timeout');
        this.handleLogout('inactivity_timeout');
        return false;
      }
    }

    return true;
  }

  /**
   * Handle user inactivity
   */
  private handleInactivity(): void {
    if (this.isDestroyed) return;

    console.log('⚠️ User inactive for extended period');
    
    // Show warning before logout
    const warningShown = this.showInactivityWarning();
    
    if (!warningShown) {
      this.handleLogout('inactivity');
    }
  }

  /**
   * Show inactivity warning
   */
  private showInactivityWarning(): boolean {
    // This would integrate with your toast/notification system
    console.log('⚠️ Showing inactivity warning');
    
    // Give user 2 minutes to respond
    setTimeout(() => {
      if (!this.isDestroyed) {
        this.handleLogout('inactivity_warning_timeout');
      }
    }, 2 * 60 * 1000);
    
    return true;
  }

  /**
   * Handle logout with reason
   */
  private async handleLogout(reason: string): Promise<void> {
    if (this.isDestroyed) return;

    console.log(`🔓 Handling logout due to: ${reason}`);
    
    try {
      // Clear all authentication data
      tokenUtils.removeAuthToken();
      userDataUtils.clearUserData();
      
      // Log security event
      this.logSecurityEvent('logout', reason);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/sign-up')) {
          window.location.href = '/login';
        }
      }
      
    } catch (error) {
      console.error('Logout handling failed:', error);
    } finally {
      this.destroy();
    }
  }

  /**
   * Log security events for monitoring
   */
  private logSecurityEvent(type: string, reason: string): void {
    const event = {
      type,
      reason,
      timestamp: new Date().toISOString(),
      sessionDuration: this.sessionStartTime ? Date.now() - this.sessionStartTime : 0,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    console.log('🔒 Security Event:', event);
    
    // In production, send to security monitoring service
    // securityMonitoring.logEvent(event);
  }

  /**
   * Get session information
   */
  public getSessionInfo(): {
    isValid: boolean;
    startTime: number | null;
    lastActivity: number | null;
    duration: number;
    remainingTime: number;
  } {
    const now = Date.now();
    const duration = this.sessionStartTime ? now - this.sessionStartTime : 0;
    const timeSinceActivity = this.lastActivityTime ? now - this.lastActivityTime : 0;
    const remainingTime = Math.max(0, SECURITY_CONFIG.session.maxAge - timeSinceActivity);
    
    return {
      isValid: this.checkSessionValidity(),
      startTime: this.sessionStartTime,
      lastActivity: this.lastActivityTime,
      duration,
      remainingTime,
    };
  }

  /**
   * Extend session (call on user activity)
   */
  public extendSession(): void {
    this.recordActivity();
  }

  /**
   * Manually destroy session
   */
  public async destroy(): Promise<void> {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    
    // Clear timers
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
    
    if (this.securityChecks) {
      clearInterval(this.securityChecks);
      this.securityChecks = null;
    }
    
    console.log('🔒 Session security manager destroyed');
  }

  /**
   * Cleanup method
   */
  private cleanup(): void {
    this.destroy();
  }
}

// Create singleton instance
export const sessionSecurity = new SessionSecurityManager();

/**
 * CSRF Protection utilities
 */
export class CSRFProtection {
  private static token: string | null = null;
  
  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    if (typeof window === 'undefined') return '';
    
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Store in session storage (not localStorage for security)
    sessionStorage.setItem('csrf_token', this.token);
    
    return this.token;
  }
  
  /**
   * Get current CSRF token
   */
  static getToken(): string | null {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('csrf_token');
    }
    
    return this.token;
  }
  
  /**
   * Validate CSRF token
   */
  static validateToken(token: string): boolean {
    const currentToken = this.getToken();
    return currentToken !== null && currentToken === token;
  }
  
  /**
   * Clear CSRF token
   */
  static clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('csrf_token');
    }
  }
}

/**
 * Browser fingerprinting for additional security
 */
export class BrowserFingerprint {
  private static fingerprint: string | null = null;
  
  /**
   * Generate browser fingerprint
   */
  static async generate(): Promise<string> {
    if (this.fingerprint) return this.fingerprint;
    
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      this.getCanvasFingerprint(),
      this.getWebGLFingerprint(),
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0,
    ];
    
    const fingerprint = components.join('|');
    this.fingerprint = await this.hashString(fingerprint);
    
    return this.fingerprint;
  }
  
  /**
   * Generate canvas fingerprint
   */
  private static getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
      
      return canvas.toDataURL();
    } catch (error) {
      return 'canvas-error';
    }
  }
  
  /**
   * Generate WebGL fingerprint
   */
  private static getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';
      
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      return `${vendor}|${renderer}`;
    } catch (error) {
      return 'webgl-error';
    }
  }
  
  /**
   * Hash string using crypto API
   */
  private static async hashString(str: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback to simple hash
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString(16);
    }
  }
  
  /**
   * Get stored fingerprint
   */
  static get(): string | null {
    return this.fingerprint;
  }
}

/**
 * Content Security Policy utilities
 */
export class ContentSecurityPolicy {
  /**
   * Generate nonce for inline scripts
   */
  static generateNonce(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  
  /**
   * Validate script source
   */
  static validateScriptSource(src: string): boolean {
    const allowedDomains = [
      'cdnjs.cloudflare.com',
      'googleapis.com',
      'gstatic.com',
    ];
    
    try {
      const url = new URL(src);
      return allowedDomains.some(domain => url.hostname.endsWith(domain));
    } catch (error) {
      return false;
    }
  }
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  /**
   * Sanitize HTML input
   */
  static sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  /**
   * Remove dangerous characters
   */
  static removeDangerousChars(input: string): string {
    return input
      .replace(/[<>'"&]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '');
  }
  
  /**
   * Validate input length
   */
  static validateLength(input: string, maxLength: number): boolean {
    return input.length <= maxLength;
  }
}