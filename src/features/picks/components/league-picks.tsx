import { useState } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import { PickDisplay } from "./pick-display";
import { WeekSwitcher } from "./week-switcher";
import { UserDisplay } from "@/components/ui/user-display";
import type { PopulatedPickResponse } from "../picks.types";
import type { PopulatedPhaseResponse } from "../../phases/phases.types";
import type { ProfileResponse } from "../../profiles/profiles.types";
import type { PopulatedPickEmStandingsResponse } from "@/features/standings/standings.types";

interface LeaguePicksProps {
  phase: PopulatedPhaseResponse;
  allPicks: PopulatedPickResponse[];
  standings: PopulatedPickEmStandingsResponse[];
  isATS?: boolean;
}

interface MemberPicksCardProps {
  member: {
    profile: ProfileResponse;
    picks: PopulatedPickResponse[];
    standings?: PopulatedPickEmStandingsResponse;
  };
  isATS?: boolean;
}

function MemberPicksCard({ member, isATS }: MemberPicksCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const standings = member.standings;

  return (
    <Card>
      <CardHeader
        className={`pb-3 cursor-pointer transition-colors hover:bg-secondary/40 rounded-t-lg ${isExpanded ? "bg-secondary/20" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <UserDisplay
              profile={member.profile}
              showUsername={true}
              showFullName={true}
              avatarSize="md"
            />
            {standings && (
              <div className="flex flex-wrap items-center gap-3 text-sm mt-2 sm:mt-0 w-full sm:w-auto">
                <div className="flex items-center bg-secondary/50 rounded-full px-3 py-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    RANK
                  </span>
                  <span className="font-semibold">#{standings.rank}</span>
                </div>
                <div className="flex items-center bg-secondary/50 rounded-full px-3 py-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    RECORD
                  </span>
                  <span className="font-semibold">
                    {standings.metadata.wins}-{standings.metadata.losses}-
                    {standings.metadata.pushes}
                  </span>
                </div>
                <div className="flex items-center bg-secondary/50 rounded-full px-3 py-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    POINTS
                  </span>
                  <span className="font-semibold">{standings.points}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground sm:self-center">
            <span>{isExpanded ? "Hide" : "Show"} Picks</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {member.picks.map((pick) => (
            <PickDisplay
              key={pick.id}
              event={pick.event!}
              userPick={pick}
              isATS={isATS}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

const routeApi = getRouteApi(
  "/_authenticated/football/pick-em/$leagueId/league-picks",
);

export function LeaguePicks({
  phase,
  allPicks,
  standings,
  isATS = false,
}: LeaguePicksProps) {
  const navigate = useNavigate();
  const { leagueId } = routeApi.useParams();

  const now = new Date();
  const pickLockTime = new Date(phase.pickLockTime);
  const isPicksLocked = now >= pickLockTime;

  const handlePhaseSelect = (phaseId: string) => {
    // Navigate to the new phase
    navigate({
      to: "/football/pick-em/$leagueId/league-picks",
      params: { leagueId },
      search: { phaseId },
    });
  };

  // Build the phases array for the WeekSwitcher
  // We'll include the current phase and any previous/next phases if available
  const phases: PopulatedPhaseResponse[] = [];

  if (phase.previousPhase) {
    phases.push({
      ...phase.previousPhase,
      previousPhase: undefined,
      nextPhase: phase,
    });
  }

  phases.push(phase);

  if (phase.nextPhase) {
    phases.push({
      ...phase.nextPhase,
      previousPhase: phase,
      nextPhase: undefined,
    });
  }

  // Group picks by user
  const picksByUser = new Map<string, PopulatedPickResponse[]>();
  allPicks.forEach((pick) => {
    if (pick.profile) {
      const userId = pick.profile.userId;
      if (!picksByUser.has(userId)) {
        picksByUser.set(userId, []);
      }
      picksByUser.get(userId)!.push(pick);
    }
  });

  // Check if there are any events at all in this phase
  const hasAnyEvents = (phase.events || []).length > 0;

  // Create member data for display
  const membersWithPicks = Array.from(picksByUser.entries()).map(
    ([userId, picks]) => {
      const firstPick = picks[0];
      const profile = firstPick.profile!;
      const userStandings = standings.find((s) => s.userId === userId);

      return {
        profile,
        picks,
        standings: userStandings,
      };
    },
  );

  return (
    <div className="space-y-6">
      <WeekSwitcher
        phases={phases}
        selectedPhaseId={phase.id}
        onSelect={handlePhaseSelect}
      />

      {/* Pick lock time warning */}
      {!isPicksLocked && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <span>
              League member picks will be visible after the pick lock time:{" "}
              <span className="font-semibold">
                {pickLockTime.toLocaleString()}
              </span>
            </span>
          </AlertDescription>
        </Alert>
      )}

      {!hasAnyEvents ? (
        // No events in this phase
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            This week doesn't have any games yet.
          </p>
        </div>
      ) : !isPicksLocked ? (
        // Picks are not yet visible
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            League member picks will be visible after the pick lock time.
          </p>
        </div>
      ) : membersWithPicks.length === 0 ? (
        // No picks made yet
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No picks have been made for this week yet.
          </p>
        </div>
      ) : (
        // Show member picks
        <div className="space-y-4">
          {membersWithPicks.map((member) => (
            <MemberPicksCard
              key={member.profile.userId}
              member={member}
              isATS={isATS}
            />
          ))}
        </div>
      )}
    </div>
  );
}
