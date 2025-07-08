import React, { useState } from "react";
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
import {
  Trophy,
  Home,
  ClipboardList,
  Menu as MenuIcon,
  Icon,
  UserX,
  CheckSquare,
  UserRound,
} from "lucide-react";
import { football } from "@lucide/lab";
import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "@/api/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex justify-between items-center h-16 w-full px-4">
        <div className="md:hidden flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsSheetOpen(!isSheetOpen)}
              >
                <MenuIcon className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Choose your game.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 p-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 rounded hover:bg-accent"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <Home className="w-5 h-5 text-primary" /> Home
                </Link>
                <div className="mt-2">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <Icon
                      iconNode={football}
                      className="w-5 h-5 text-primary"
                    />{" "}
                    Football
                  </div>
                  <div className="flex flex-col gap-1 pl-6">
                    <Link
                      to="/football/pick-em"
                      className="flex items-center gap-2 py-2 px-2 rounded"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <CheckSquare className="w-4 h-4 text-primary" /> Pick'em
                    </Link>
                    <div className="flex items-center gap-2 py-2 px-2 rounded text-muted-foreground">
                      <UserX className="w-4 h-4 text-primary" /> Elimination
                      Pools (coming soon)
                    </div>
                    <div className="flex items-center gap-2 py-2 px-2 rounded text-muted-foreground">
                      <ClipboardList className="w-4 h-4 text-primary" /> Team
                      Drafts (coming soon)
                    </div>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="flex" asChild>
                  <Link
                    to="/"
                    className="flex flex-row items-center gap-1 px-2 py-1"
                  >
                    <Home className="w-5 h-5 text-primary" />
                    <span>Home</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Icon iconNode={football} className="w-5 h-5 text-primary" />
                  <span>Football</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col min-w-[200px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/football/pick-em"
                        className="flex flex-row items-center gap-2 px-3 py-2"
                      >
                        <CheckSquare className="w-4 h-4 text-primary" /> Pick'em
                      </Link>
                    </NavigationMenuLink>
                    <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
                      <UserX className="w-4 h-4 text-primary" /> Elimination
                      Pools (coming soon)
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
                      <ClipboardList className="w-4 h-4 text-primary" /> Team
                      Drafts (coming soon)
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <span className="font-bold text-lg select-none flex items-center gap-2">
            Picks Leagues
            <Trophy className="w-8 h-8 text-primary" />
          </span>
        </div>
        <div className="flex items-center">{rightContent}</div>
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
                  <UserRound className="w-4 h-4 text-primary" />
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
