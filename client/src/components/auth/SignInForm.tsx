import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema } from "@/lib/validators";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { SignInFormValues } from "@shared/schema";

interface SignInFormProps {
  onShowSignUp: () => void;
  onShowForgotPassword: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onShowSignUp,
  onShowForgotPassword,
}) => {
  const { login, isLoginLoading, handleGoogleAuth } = useAuth();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    login(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium cursor-pointer">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            variant="link"
            type="button"
            className="text-sm font-medium text-primary p-0 h-auto"
            onClick={onShowForgotPassword}
          >
            Forgot your password?
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoginLoading}>
          {isLoginLoading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <GoogleSignInButton type="button" onClick={handleGoogleAuth}>
          Google
        </GoogleSignInButton>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button
            variant="link"
            type="button"
            className="text-primary p-0 h-auto font-medium"
            onClick={onShowSignUp}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
