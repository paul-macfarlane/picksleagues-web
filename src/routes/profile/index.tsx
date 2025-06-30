import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

// todo integrate data fetching
// todo integrate form and validation
// todo use query params to see if user is editing or setting up for the first time

function RouteComponent() {
  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" autoComplete="off">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/80x80" alt="Profile" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profilePicUrl">Profile Picture URL</label>
              <Input
                id="profilePicUrl"
                placeholder="https://..."
                value="https://placehold.co/80x80"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                placeholder="username"
                value="johndoe"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="firstname">First Name</label>
              <Input
                id="firstname"
                placeholder="First Name"
                value="John"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastname">Last Name</label>
              <Input
                id="lastname"
                placeholder="Last Name"
                value="Doe"
                disabled
              />
            </div>
            <Button type="submit" className="mt-2" disabled>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
