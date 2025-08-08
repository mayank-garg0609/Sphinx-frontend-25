import type { UserData, UserPreferences, User } from '../types/authTypes';

export const saveAuthToken = (token: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
};

export const saveUserData = (user: User): void => {
  try {
    if (typeof window !== 'undefined') {
      const userCache: UserData = {
        sphinx_id: user.sphinx_id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        applied_ca: user.applied_ca,
        last_login: new Date().toISOString(),
        created_at: user.created_at,
      };
      
      localStorage.setItem('user_data', JSON.stringify(userCache));
      
      const existingPrefs = localStorage.getItem('user_preferences');
      if (!existingPrefs) {
        const defaultPrefs: UserPreferences = {
          theme: 'dark',
          notifications: true,
          language: 'en',
        };
        localStorage.setItem('user_preferences', JSON.stringify(defaultPrefs));
      }
    }
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const handleAuthSuccess = (token: string, user: User, router: any): void => {
  try {
    saveAuthToken(token);
    saveUserData(user);
    
    setTimeout(() => {
      router.push('/');
    }, 500);
  } catch (error) {
    console.error('Auth success handling failed:', error);
    throw new Error('Login successful but navigation failed. Please refresh the page.');
  }
};