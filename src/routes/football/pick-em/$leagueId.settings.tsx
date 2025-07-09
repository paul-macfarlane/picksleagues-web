import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock settings data
const mockSettings = {
  leagueName: "Office Pick'em League",
  logoUrl: "https://github.com/shadcn.png",
  leagueSize: 12,
  picksPerPhase: 5,
};

export const Route = createFileRoute("/football/pick-em/$leagueId/settings")({
  component: SettingsComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function SettingsComponent() {
  // TODO: Refactor to get isCommissioner and seasonState from API
  const isCommissioner = false;
  const isOffSeason = false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>League Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="leagueName">League Name</Label>
          <Input
            id="leagueName"
            defaultValue={mockSettings.leagueName}
            disabled={!isCommissioner}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            defaultValue={mockSettings.logoUrl}
            disabled={!isCommissioner}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="leagueSize">League Size</Label>
            <Input
              id="leagueSize"
              type="number"
              defaultValue={mockSettings.leagueSize}
              disabled={!isCommissioner || !isOffSeason}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="picksPerPhase">Picks Per Week</Label>
            <Input
              id="picksPerPhase"
              type="number"
              defaultValue={mockSettings.picksPerPhase}
              disabled={!isCommissioner || !isOffSeason}
            />
          </div>
        </div>
      </CardContent>
      {isCommissioner && (
        <CardFooter className="flex justify-between">
          <Button variant="destructive" disabled={!isOffSeason}>
            Delete League
          </Button>
          <Button>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
}
