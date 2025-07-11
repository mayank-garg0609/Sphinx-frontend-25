import { RequestTracker } from "../types/profileTypes";
import { MAX_REQUESTS_PER_SESSION, RATE_LIMIT_RESET_TIME } from "../utils/constants";

export const getRequestTracker = (): RequestTracker => {
  try {
    const stored = sessionStorage.getItem("profile_request_tracker");
    if (stored) {
      const tracker = JSON.parse(stored) as RequestTracker;
      const now = Date.now();
      
      if (now - tracker.lastReset > RATE_LIMIT_RESET_TIME) {
        return { count: 0, lastReset: now, blocked: false };
      }
      
      return tracker;
    }
  } catch (error) {
    console.error("Failed to get request tracker:", error);
  }
  
  return { count: 0, lastReset: Date.now(), blocked: false };
};

export const updateRequestTracker = (tracker: RequestTracker): void => {
  try {
    sessionStorage.setItem("profile_request_tracker", JSON.stringify(tracker));
  } catch (error) {
    console.error("Failed to update request tracker:", error);
  }
};

export const canMakeRequest = (): boolean => {
  const tracker = getRequestTracker();
  
  if (tracker.blocked) {
    return false;
  }
  
  if (tracker.count >= MAX_REQUESTS_PER_SESSION) {
    tracker.blocked = true;
    updateRequestTracker(tracker);
    return false;
  }
  
  return true;
};

export const incrementRequestCount = (): void => {
  const tracker = getRequestTracker();
  tracker.count++;
  updateRequestTracker(tracker);
};