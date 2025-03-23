import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordFormSchema } from "@/lib/validators";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ForgotPasswordFormValues } from "@shared/schema";

interface ForgotPasswordFormProps {
  onShowSignIn: () => void;
  onShowResetSent: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onShowSignIn,
  onShowResetSent,
}) => {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data.email, {
      onSuccess: () => {
        onShowResetSent();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-sm text-muted-foreground mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </div>
        
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

        <Button type="submit" className="w-full" disabled={isForgotPasswordLoading}>
          {isForgotPasswordLoading ? "Sending..." : "Send reset link"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Button
            variant="link"
            type="button"
            className="text-primary p-0 h-auto font-medium"
            onClick={onShowSignIn}
          >
            Back to sign in
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
