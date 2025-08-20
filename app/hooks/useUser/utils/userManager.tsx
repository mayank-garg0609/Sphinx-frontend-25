// Fixed userManager.tsx
import { UserData, User } from "../types/userCache";

class UserManagerSingleton {
  private userData: UserData | null = null;
  private storageKey = 'user_data_v2'; // Changed key to avoid conflicts

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Try localStorage first (more persistent), then sessionStorage
        let stored = localStorage.getItem(this.storageKey);
        if (!stored) {
          stored = sessionStorage.getItem(this.storageKey);
        }
        
        if (stored) {
          this.userData = JSON.parse(stored) as UserData;
          console.log("👤 UserManager restored user data:", {
            hasUser: !!this.userData,
            email: this.userData?.email,
            name: this.userData?.name,
            sphinx_id: this.userData?.sphinx_id
          });
        }
      } catch (error) {
        console.error("Failed to restore user data from storage:", error);
        this.clearUser();
      }
    }
  }

  setUser(user: User): void {
    console.log("👤 UserManager setUser() called with:", {
      name: user.name,
      email: user.email,
      sphinx_id: user.sphinx_id,
      role: user.role
    });

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
        const userDataString = JSON.stringify(this.userData);
        
        // Store in both localStorage and sessionStorage for maximum reliability
        localStorage.setItem(this.storageKey, userDataString);
        sessionStorage.setItem(this.storageKey, userDataString);
        
        console.log("💾 User data stored in both localStorage and sessionStorage");
      } catch (error) {
        console.error("Failed to store user data:", error);
      }
    }

    console.log("👤 UserManager user set successfully");
  }

  getUser(): UserData | null {
    // Always try to get fresh data from storage
    if (typeof window !== "undefined") {
      try {
        // Try localStorage first, then sessionStorage
        let stored = localStorage.getItem(this.storageKey);
        if (!stored) {
          stored = sessionStorage.getItem(this.storageKey);
        }
        
        if (stored) {
          this.userData = JSON.parse(stored) as UserData;
          return this.userData;
        } else if (this.userData) {
          console.log("⚠️ User data was in memory but not in storage - data was cleared externally");
          this.userData = null;
        }
      } catch (error) {
        console.error("Failed to restore user data from storage:", error);
        this.clearUser();
        return null;
      }
    }

    return this.userData;
  }

  clearUser(): void {
    console.log("🧹 UserManager clearUser() called");

    this.userData = null;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.storageKey);
        // Also remove old storage keys if they exist
        localStorage.removeItem("user_data");
        sessionStorage.removeItem("user_data");
        localStorage.removeItem("user_preferences");
        sessionStorage.removeItem("user_preferences");
        console.log("🧹 Removed user data from both storage types");
      } catch (error) {
        console.error("Failed to clear user data from storage:", error);
      }
    }

    console.log("👤 UserManager cleared user data");
  }

  updateUser(updates: Partial<UserData>): void {
    console.log("👤 UserManager updateUser() called with updates:", updates);

    // Ensure we have current user data
    const currentUser = this.getUser();
    
    if (currentUser) {
      this.userData = { ...currentUser, ...updates };
      
      if (typeof window !== "undefined") {
        try {
          const userDataString = JSON.stringify(this.userData);
          localStorage.setItem(this.storageKey, userDataString);
          sessionStorage.setItem(this.storageKey, userDataString);
        } catch (error) {
          console.error("Failed to update user data in storage:", error);
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