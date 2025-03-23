import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface GoogleSignInButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GoogleSignInButton = React.forwardRef<
  HTMLButtonElement,
  GoogleSignInButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50",
        className
      )}
      {...props}
    >
      <FaGoogle className="h-4 w-4 text-red-500" />
      {children}
    </Button>
  );
});

GoogleSignInButton.displayName = "GoogleSignInButton";

export { GoogleSignInButton };
