// app/(auth)/login/page.tsx
"use client";

import { useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { BackgroundImage } from "./components/BackgroundImage";
import { MOBILE_STYLES } from "./utils/constants";

export default function LoginPage() {
  // Security: Set additional client-side security measures
  useEffect(() => {
    // Prevent iframe embedding (clickjacking protection)
    if (window.self !== window.top) {
      window.top!.location = window.self.location;
    }

    // Disable context menu to prevent "inspect element" (basic protection)
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    // Disable common developer shortcuts in production
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+J
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Set page title and meta for SEO and security
  useEffect(() => {
    document.title = "Login - Sphinx'25";
    
    // Set meta tags for security
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Security headers
    setMetaTag('referrer', 'strict-origin-when-cross-origin');
    setMetaTag('robots', 'noindex, nofollow'); // Don't index login pages
    
    // Viewport and accessibility
    const setViewportMeta = () => {
      let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1.0, shrink-to-fit=no';
    };

    setViewportMeta();
  }, []);

  return (
    <main className={MOBILE_STYLES.container} role="main">
      {/* Skip navigation link for accessibility */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded z-50"
      >
        Skip to login form
      </a>

      {/* Background Image */}
      <section aria-hidden="true" className="absolute inset-0">
        <BackgroundImage />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 lg:bg-gradient-to-r lg:from-black/40 lg:via-black/20 lg:to-transparent" />
      </section>

      {/* Main Content */}
      <section 
        className={MOBILE_STYLES.formWrapper}
        aria-labelledby="login-heading"
      >
        <div id="login-form">
          <LoginForm />
        </div>
      </section>

      {/* Structured Data for SEO (optional, mainly for enterprise apps) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login - Sphinx'25",
            "description": "Secure login page for Sphinx'25 application",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "isAccessibleForFree": true,
            "potentialAction": {
              "@type": "LoginAction",
              "target": typeof window !== 'undefined' ? window.location.href : '',
            }
          })
        }}
      />
    </main>
  );
}