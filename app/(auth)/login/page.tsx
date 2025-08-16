"use client";

import { useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { BackgroundImage } from "./components/BackgroundImage";
import { MOBILE_STYLES } from "./utils/constants";

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
    <main className={MOBILE_STYLES.container} role="main">
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded z-50"
      >
        Skip to login form
      </a>

      <section aria-hidden="true" className="absolute inset-0">
        <BackgroundImage />
        <div className="absolute inset-0 bg-black/20 lg:bg-gradient-to-r lg:from-black/40 lg:via-black/20 lg:to-transparent" />
      </section>

      <section
        className={MOBILE_STYLES.formWrapper}
        aria-labelledby="login-heading"
      >
        <div id="login-form">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
