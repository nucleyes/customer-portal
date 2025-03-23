import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Save } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateFormSchema } from "@/lib/validators";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface ProfileFormValues {
  name: string;
  username: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile, isUpdateProfileLoading } = useAuth();
  const [_, setLocation] = useLocation();

  // Protected route check
  const { isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      if (res.status === 401) {
        setLocation("/auth");
        return null;
      }
      
      return res.json();
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateFormSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        username: user.username,
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 pl-0 flex items-center text-muted-foreground hover:text-foreground"
            onClick={() => setLocation("/dashboard")}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Profile Picture</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a profile picture (coming soon)
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto flex items-center"
                    disabled={isUpdateProfileLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isUpdateProfileLoading ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-1">Email address</h3>
              <p className="text-sm text-gray-500 mb-1">{user.email}</p>
              <p className="text-xs text-gray-500">
                Your email address is{" "}
                <span className={user.emailVerified ? "text-green-600" : "text-red-600"}>
                  {user.emailVerified ? "verified" : "not verified"}
                </span>
              </p>
              {!user.emailVerified && (
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  Resend verification email
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Password</h3>
              <p className="text-sm text-gray-500 mb-2">
                Change your password regularly to keep your account secure.
              </p>
              <Button variant="outline" size="sm">
                Change password
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-red-600 mb-1">Danger Zone</h3>
              <p className="text-sm text-gray-500 mb-2">
                Permanently delete your account and all of your data.
              </p>
              <Button variant="destructive" size="sm">
                Delete account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
