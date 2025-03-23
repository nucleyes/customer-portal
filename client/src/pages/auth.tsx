import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import EmailVerificationSent from "@/components/auth/EmailVerificationSent";
import PasswordResetSent from "@/components/auth/PasswordResetSent";
import AuthAlertComponent from "@/components/auth/AuthAlertComponent";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

type FormType = "signin" | "signup" | "forgotPassword" | "emailVerificationSent" | "passwordResetSent";

const Auth: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<FormType>("signin");
  const [alert, setAlert] = useState({
    type: "error" as "error" | "success" | "info",
    message: "",
    visible: false,
  });
  const [email, setEmail] = useState<string>("");
  
  const { isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const getTitleAndSubtitle = () => {
    switch (currentForm) {
      case "signin":
        return {
          title: "Account Access",
          subtitle: "Sign in to your account",
        };
      case "signup":
        return {
          title: "Account Access",
          subtitle: "Create a new account",
        };
      case "forgotPassword":
        return {
          title: "Account Access",
          subtitle: "Reset your password",
        };
      case "emailVerificationSent":
        return {
          title: "Account Access",
          subtitle: "Verify your email",
        };
      case "passwordResetSent":
        return {
          title: "Account Access",
          subtitle: "Reset link sent",
        };
      default:
        return {
          title: "Account Access",
          subtitle: "Sign in to your account",
        };
    }
  };

  const showAlert = (type: "error" | "success" | "info", message: string) => {
    setAlert({
      type,
      message,
      visible: true,
    });
  };

  const dismissAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  const showSignIn = () => {
    setCurrentForm("signin");
  };

  const showSignUp = () => {
    setCurrentForm("signup");
  };

  const showForgotPassword = () => {
    setCurrentForm("forgotPassword");
  };

  const showVerificationSent = (userEmail?: string) => {
    if (userEmail) {
      setEmail(userEmail);
    }
    setCurrentForm("emailVerificationSent");
  };

  const showResetSent = (userEmail?: string) => {
    if (userEmail) {
      setEmail(userEmail);
    }
    setCurrentForm("passwordResetSent");
  };

  const { title, subtitle } = getTitleAndSubtitle();

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <AuthAlertComponent
        type={alert.type}
        message={alert.message}
        visible={alert.visible}
        onDismiss={dismissAlert}
      />

      {currentForm === "signin" && (
        <SignInForm
          onShowSignUp={showSignUp}
          onShowForgotPassword={showForgotPassword}
        />
      )}

      {currentForm === "signup" && (
        <SignUpForm
          onShowSignIn={showSignIn}
          onShowVerificationSent={() => showVerificationSent(email)}
        />
      )}

      {currentForm === "forgotPassword" && (
        <ForgotPasswordForm
          onShowSignIn={showSignIn}
          onShowResetSent={() => showResetSent(email)}
        />
      )}

      {currentForm === "emailVerificationSent" && (
        <EmailVerificationSent onShowSignIn={showSignIn} email={email} />
      )}

      {currentForm === "passwordResetSent" && (
        <PasswordResetSent onShowSignIn={showSignIn} email={email} />
      )}
    </AuthLayout>
  );
};

export default Auth;
