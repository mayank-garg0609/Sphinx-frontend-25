import { UserData } from "../types/userCache";

class UserManagerSingleton {
  private userData: UserData | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user_data");
        if (stored) {
          this.userData = JSON.parse(stored) as UserData;
        }
      } catch (error) {
        console.error("Failed to restore user data from session:", error);
      }
    }
  }

  setUser(user: UserData): void {
    this.userData = {
      sphinx_id: user.sphinx_id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      applied_ca: user.applied_ca,
      last_login: new Date().toISOString(),
      created_at: user.created_at,
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("user_data", JSON.stringify(this.userData));
      } catch (error) {
        console.error("Failed to store user data in session:", error);
      }
    }
  }

  getUser(): UserData | null {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user_data");
        console.log("works2");
        this.userData = stored ? (JSON.parse(stored) as UserData) : null;
        return this.userData;
      } catch (error) {
        console.error("Failed to restore user data from session:", error);
        return null;
      }
    }

    return null;
  }

  clearUser(): void {
    this.userData = null;
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("user_data");
        sessionStorage.removeItem("user_preferences");
      } catch (error) {
        console.error("Failed to clear user data from session:", error);
      }
    }
  }

  updateUser(updates: Partial<UserData>): void {
    if (!this.userData && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user_data");
        this.userData = stored ? (JSON.parse(stored) as UserData) : null;
      } catch (error) {
        console.error("Failed to load user data before update:", error);
      }
    }

    if (this.userData) {
      this.userData = { ...this.userData, ...updates };
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("user_data", JSON.stringify(this.userData));
        } catch (error) {
          console.error("Failed to update user data in session:", error);
        }
      }
    }
  }
}

export const userManager = new UserManagerSingleton();
