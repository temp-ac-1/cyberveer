import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, AlertTriangle } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser, setIsLoggedIn } from "@/redux/authSlice";

export function LogoutConfirmDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/logout", {
        withCredentials: true,
      });
      dispatch(setAuthUser(null)); // Set the user data in redux
      dispatch(setIsLoggedIn(false)); // Only set logged in after user data is fetched

      toast(res.data.message);

      onOpenChange(false);

      // Optionally redirect to login page
      // window.location.href = '/login';
    } catch (error) {
      console.log(error)
      toast("Failed to logout. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background/95 backdrop-blur border-border/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to log out? You'll need to sign in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-border/50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
