import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import type { ProfileResponse } from "@/features/profiles/profiles.types";

interface UserDisplayProps {
  profile: ProfileResponse;
  showUsername?: boolean;
  showFullName?: boolean;
  avatarSize?: "sm" | "md" | "lg";
  className?: string;
}

export function UserDisplay({
  profile,
  showUsername = true,
  showFullName = true,
  avatarSize = "md",
  className = "",
}: UserDisplayProps) {
  const avatarSizes = {
    sm: "h-6 w-6",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className={avatarSizes[avatarSize]}>
        <AvatarImage
          src={profile.avatarUrl ?? undefined}
          alt={`${profile.firstName} ${profile.lastName}`}
        />
        <AvatarFallback>
          <UserRound className={`${iconSizes[avatarSize]} text-primary`} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        {showUsername && (
          <span className="font-medium text-sm text-muted-foreground truncate">
            @{profile.username}
          </span>
        )}
        {showFullName && (
          <span className="font-medium truncate">
            {profile.firstName} {profile.lastName}
          </span>
        )}
      </div>
    </div>
  );
}
