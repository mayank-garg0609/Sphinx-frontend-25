"use client";

import { LoginForm } from "./components/LoginForm";
import { BackgroundImage } from "./components/BackgroundImage";
import { MOBILE_STYLES } from "./utils/constants";

export default function LoginPage() {
  return (
    <div className={MOBILE_STYLES.container}>
      <BackgroundImage />
      
      <div className={MOBILE_STYLES.formWrapper}>
        <LoginForm />
      </div>
    </div>
  );
}