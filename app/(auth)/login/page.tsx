"use client";

import { useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { BackgroundImage } from "./components/BackgroundImage";
import { API_ENDPOINTS } from "./utils/config";
import { API_CONFIG } from "./utils/config";
import { getApiUrl } from "./utils/config";

export default function LoginPage() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === "production") {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
          (e.ctrlKey && e.key === "U")
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const debugApiConfig = () => {
      console.log("🔧 API Configuration Debug:", {
        baseUrl: API_CONFIG.baseUrl,
        loginEndpoint: getApiUrl(API_ENDPOINTS.LOGIN),
        environment: process.env.NODE_ENV,
        envVars: {
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
          hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        }
      });
    };

    const testBackendConnection = async () => {
      const baseUrl = API_CONFIG.baseUrl;
      console.log("🧪 Testing backend connection to:", baseUrl);
      
      try {
        const response = await fetch(baseUrl, {
          method: 'GET',
          mode: 'cors'
        });
        
        console.log("🧪 Backend connection test:", {
          status: response.status,
          ok: response.ok
        });
      } catch (error) {
        console.error("🧪 Backend connection failed:", error);
      }
    };

    debugApiConfig();
    testBackendConnection();
  }, []);

  useEffect(() => {
    document.title = "Login - Sphinx'25";

    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMetaTag("referrer", "strict-origin-when-cross-origin");
    setMetaTag("robots", "noindex, nofollow"); // Don't index login pages

    const setViewportMeta = () => {
      let viewport = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement;
      if (!viewport) {
        viewport = document.createElement("meta");
        viewport.name = "viewport";
        document.head.appendChild(viewport);
      }
      viewport.content =
        "width=device-width, initial-scale=1.0, shrink-to-fit=no";
    };

    setViewportMeta();
  }, []);

  return (
    <main className="min-h-screen w-full flex bg-black relative overflow-hidden">
      {/* Background */}
      <section aria-hidden="true" className="absolute inset-0">
        <BackgroundImage />
        <div className="absolute inset-0 bg-black/20 lg:bg-gradient-to-r lg:from-black/60 lg:via-black/40 lg:to-black/20" />
      </section>

      {/* Content */}
      <section className="relative z-10 flex items-center justify-center w-full px-4 py-8 lg:justify-end lg:pr-16 xl:pr-24 2xl:pr-32">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}