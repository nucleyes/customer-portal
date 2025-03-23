import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, logout, isLogoutLoading } = useAuth();
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name || user.username}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/profile")}
              className="text-sm"
            >
              Profile
            </Button>
            <Button
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="text-sm"
            >
              {isLogoutLoading ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt={user.username} />
                  <AvatarFallback className="bg-primary text-white">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium">{user.name || user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Username:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email Verified:</span>
                  <span className={`font-medium ${user.emailVerified ? "text-green-600" : "text-red-600"}`}>
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-sm" onClick={() => setLocation("/profile")}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Password</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Your password was last changed never.
                  </p>
                  <Button variant="outline" size="sm" className="text-sm">
                    Change Password
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline" size="sm" className="text-sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
