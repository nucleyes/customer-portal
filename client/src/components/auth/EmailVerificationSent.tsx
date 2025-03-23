import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EmailVerificationSentProps {
  onShowSignIn: () => void;
  email?: string;
}

const EmailVerificationSent: React.FC<EmailVerificationSentProps> = ({
  onShowSignIn,
  email,
}) => {
  const { register, isRegisterLoading } = useAuth();

  const handleResendVerification = () => {
    if (email) {
      // In a real app, this would resend the verification email
      // For this demo, we'll just show a success message
      register(
        { email, username: "", password: "", name: "" },
        {
          onSuccess: () => {
            // Show success message
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-foreground">
          Verification email sent
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We've sent a verification link to your email address. Please check your
          inbox and click the link to verify your account.
        </p>
      </div>
      
      <Button
        type="button"
        className="w-full"
        onClick={handleResendVerification}
        disabled={isRegisterLoading}
      >
        {isRegisterLoading ? "Sending..." : "Resend verification email"}
      </Button>
      
      <div className="text-center text-sm">
        <Button
          variant="link"
          type="button"
          className="text-primary p-0 h-auto font-medium"
          onClick={onShowSignIn}
        >
          Back to sign in
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationSent;
