import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PasswordResetSentProps {
  onShowSignIn: () => void;
  email?: string;
}

const PasswordResetSent: React.FC<PasswordResetSentProps> = ({
  onShowSignIn,
  email,
}) => {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();

  const handleResendReset = () => {
    if (email) {
      forgotPassword(email);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Mail className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Check your email
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          We've sent a password reset link to your email address. Please check
          your inbox and click the link to reset your password.
        </p>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleResendReset}
        disabled={isForgotPasswordLoading}
      >
        {isForgotPasswordLoading ? "Sending..." : "Resend reset link"}
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

export default PasswordResetSent;
