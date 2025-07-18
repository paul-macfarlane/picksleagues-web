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
import type { PickEmLeagueResponse } from "@/features/leagues/leagues.types";

type LeagueSettingsFormProps = {
  league: PickEmLeagueResponse;
  isCommissioner: boolean;
  isOffSeason: boolean;
};

export function LeagueSettingsForm({
  league,
  isCommissioner,
  isOffSeason,
}: LeagueSettingsFormProps) {
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
            defaultValue={league.name}
            disabled={!isCommissioner}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            defaultValue={league.image ?? ""}
            disabled={!isCommissioner}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="leagueSize">League Size</Label>
            <Input
              id="leagueSize"
              type="number"
              defaultValue={league.size}
              disabled={!isCommissioner || !isOffSeason}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="picksPerPhase">Picks Per Week</Label>
            <Input
              id="picksPerPhase"
              type="number"
              defaultValue={league.settings.picksPerPhase}
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
