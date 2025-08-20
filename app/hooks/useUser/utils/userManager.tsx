import { UserData, User } from "../types/userCache";

class UserManagerSingleton {
  private userData: UserData | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user_data");
        if (stored) {
          this.userData = JSON.parse(stored) as UserData;
          console.log("👤 UserManager restored user data:", {
            hasUser: !!this.userData,
            email: this.userData?.email
          });
        }
      } catch (error) {
        console.error("Failed to restore user data from session:", error);
        this.clearUser();
      }
    }
  }

  setUser(user: User): void {
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

    console.log("👤 UserManager set user:", {
      name: this.userData.name,
      email: this.userData.email,
      role: this.userData.role
    });
  }

  getUser(): UserData | null {
    // Always try to get fresh data from sessionStorage
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user_data");
        if (stored) {
          this.userData = JSON.parse(stored) as UserData;
          return this.userData;
        }
      } catch (error) {
        console.error("Failed to restore user data from session:", error);
        this.clearUser();
        return null;
      }
    }

    return this.userData;
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

    console.log("👤 UserManager cleared user data");
  }

  updateUser(updates: Partial<UserData>): void {
    // Ensure we have current user data
    const currentUser = this.getUser();
    
    if (currentUser) {
      this.userData = { ...currentUser, ...updates };
      
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("user_data", JSON.stringify(this.userData));
        } catch (error) {
          console.error("Failed to update user data in session:", error);
        }
      }

      console.log("👤 UserManager updated user:", {
        updatedFields: Object.keys(updates),
        name: this.userData.name,
        email: this.userData.email
      });
    } else {
      console.warn("👤 UserManager: Cannot update user - no user data found");
    }
  }

  // Helper method to check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Helper method to check if user is verified
  isVerified(): boolean {
    const user = this.getUser();
    return user?.is_verified === true;
  }

  // Helper method to check if user applied for CA
  hasAppliedCA(): boolean {
    const user = this.getUser();
    return user?.applied_ca === true;
  }
}

export const userManager = new UserManagerSingleton();