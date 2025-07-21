import { useState } from "react";
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
import type { PopulatedPickEmLeagueResponse } from "@/features/leagues/leagues.types";
import { DeleteLeagueDialog } from "./delete-league-dialog";

type LeagueSettingsFormProps = {
  league: PopulatedPickEmLeagueResponse;
  canEdit: boolean;
  canEditAllSettings: boolean;
};

// TODO: right now this is only functional for pick'em leagues,
// which is probably fine for now but will need to be updated to support other league types
// (e.g. elimination, etc.)
// the other option is to just have different forms depending on league type
export function LeagueSettingsForm({
  league,
  canEdit,
  canEditAllSettings,
}: LeagueSettingsFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <>
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
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              defaultValue={league.image ?? ""}
              disabled={!canEdit}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leagueSize">League Size</Label>
              <Input
                id="leagueSize"
                type="number"
                defaultValue={league.size}
                disabled={!canEditAllSettings}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picksPerPhase">Picks Per Week</Label>
              <Input
                id="picksPerPhase"
                type="number"
                defaultValue={league.settings.picksPerPhase}
                disabled={!canEditAllSettings}
              />
            </div>
          </div>
        </CardContent>
        {canEdit && (
          <CardFooter className="flex justify-between">
            {canEditAllSettings && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete League
              </Button>
            )}

            <Button>Save Changes</Button>
          </CardFooter>
        )}
      </Card>
      <DeleteLeagueDialog
        leagueId={league.id}
        leagueTypeSlug={league.leagueType!.slug}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
