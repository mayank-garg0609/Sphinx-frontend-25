export interface ApiResponse<T = unknown> {
  success: boolean;
  user?: T;
  error?: string;
  message?: string;
}

export interface ProfileResponse extends ApiResponse {
  user: any;
}

export interface RequestTracker {
  count: number;
  lastReset: number;
  blocked: boolean;
}