export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem("auth_token");
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};

export const clearAuthData = (): void => {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_preferences");
    sessionStorage.removeItem("profile_request_tracker");
  } catch (error) {
    console.error("Failed to clear auth data:", error);
  }
};