import { UserData } from "../types/userCache";

export const getUserData = (): UserData | null => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};


export const isUserLoggedIn = (): boolean => {
  return getAuthToken() !== null && getUserData() !== null;
};

export const logoutUser = (): void => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_preferences');
  } catch (error) {
    console.error('Failed to logout user:', error);
  }
};