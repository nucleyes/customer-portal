import React, { ReactNode } from "react";
import { Lock } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Lock className="text-white h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card text-card-foreground py-8 px-4 shadow-md border border-border sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
