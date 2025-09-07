import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export function EditProfileDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const {user} = useSelector((store) => store.auth);

  const [username, setUsername] = useState(user.username || "");
  const [fullname, setFullname] = useState(user.fullName || "");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // dispatch(updateUser({ username, name: fullname, avatar }));
      toast("Profile updated");
      onOpenChange(false);
    } catch (error) {
      toast("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information. Changes will be saved to your
            account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={avatar} alt="Profile picture" />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-success/10 text-lg">
                  {fullname?.charAt(0) || user.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-primary-foreground">
                <Camera className="h-3 w-3" />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                Avatar URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-background/50 border-border/50 min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-cyber hover:opacity-90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
