import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AlertType = "error" | "success" | "info";

interface AuthAlertProps {
  type: AlertType;
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

const AuthAlertComponent: React.FC<AuthAlertProps> = ({
  type,
  message,
  visible,
  onDismiss,
}) => {
  if (!visible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case "error":
        return {
          className: "bg-red-50 border-red-200",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          iconClassName: "text-red-500",
        };
      case "success":
        return {
          className: "bg-green-50 border-green-200",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          iconClassName: "text-green-500",
        };
      case "info":
        return {
          className: "bg-blue-50 border-blue-200",
          icon: <Info className="h-4 w-4 text-blue-500" />,
          iconClassName: "text-blue-500",
        };
      default:
        return {
          className: "",
          icon: <Info className="h-4 w-4" />,
          iconClassName: "",
        };
    }
  };

  const { className, icon, iconClassName } = getAlertStyles();

  return (
    <Alert className={`${className} mb-4 relative`}>
      <div className="flex items-start">
        {icon}
        <AlertDescription className="ml-2 text-sm">{message}</AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto -mt-1 h-auto p-1 hover:bg-transparent"
          onClick={onDismiss}
        >
          <X className={`h-4 w-4 ${iconClassName}`} />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
};

export default AuthAlertComponent;
