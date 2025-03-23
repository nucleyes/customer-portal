import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { NucleyesLogoWithText } from "@/components/ui/NucleyesLogo";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <NucleyesLogoWithText size={36} className="text-gray-700" />
          </div>
          
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <h1 className="text-xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button 
            onClick={() => setLocation("/auth")}
            className="w-full"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
