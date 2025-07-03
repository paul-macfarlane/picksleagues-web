import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "@/api/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

function ProfileMenuSkeleton() {
  return (
    <div className="flex items-center">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}

function ProfileMenuError() {
  return (
    <div className="flex items-center">
      <Button variant="destructive" disabled>
        Error
      </Button>
    </div>
  );
}

function Navbar({ rightContent }: { rightContent: React.ReactNode }) {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-2">
        <div className="flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="md:hidden">
                  Menu
                </NavigationMenuTrigger>
                <NavigationMenuTrigger className="hidden md:inline-flex">
                  Menu
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col min-w-[180px]">
                    <NavigationMenuLink asChild>
                      <Link to="/">Home</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex-1 flex justify-center items-center text-primary">
          <span className="font-bold text-lg select-none flex items-center gap-2">
            Picks Leagues
            <Trophy className="w-8 h-8" />
          </span>
        </div>
        {rightContent}
      </div>
    </nav>
  );
}

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const { navigate } = useRouter();

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery(
    profileQueryOptions({
      enabled: !!session,
    }),
  );

  async function signOut() {
    try {
      await authClient.signOut();
      navigate({ to: "/login", reloadDocument: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to sign out: ${message}`);
    }
  }

  if (!session) {
    // don't show layout if not logged in
    return children;
  }

  let rightContent: React.ReactNode;
  if (isLoadingProfile) {
    rightContent = <ProfileMenuSkeleton />;
  } else if (profileError) {
    rightContent = <ProfileMenuError />;
  } else {
    rightContent = (
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full h-10 w-10">
              <Avatar>
                <AvatarImage
                  src={profileData?.avatarUrl ?? undefined}
                  alt={profileData?.username ?? "Profile"}
                />
                <AvatarFallback>
                  {profileData?.username?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profileData?.username || "Loading..."}
                </p>
                <span className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email || "Loading..."}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} variant="destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar rightContent={rightContent} />
      <main className="flex-1 w-full container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
