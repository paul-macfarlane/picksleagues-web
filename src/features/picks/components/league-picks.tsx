import { useState } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import { PickDisplay } from "./pick-display";
import { WeekSwitcher } from "./week-switcher";
import { UserDisplay } from "@/components/ui/user-display";
import type { PopulatedPickResponse } from "../picks.types";
import type { PopulatedPhaseResponse } from "../../phases/phases.types";
import type { PopulatedEventResponse } from "../../events/events.type";
import type { ProfileResponse } from "../../profiles/profiles.types";

interface LeaguePicksProps {
  phase: PopulatedPhaseResponse;
  allPicks: PopulatedPickResponse[];
  isATS?: boolean;
}

interface MemberPicksCardProps {
  member: {
    profile: ProfileResponse;
    picks: Array<{
      event: PopulatedEventResponse;
      pick: PopulatedPickResponse;
    }>;
  };
  isATS?: boolean;
}

function MemberPicksCard({ member, isATS }: MemberPicksCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <UserDisplay
            profile={member.profile}
            showUsername={true}
            showFullName={true}
            avatarSize="md"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {member.picks.map(({ event, pick }) => (
            <PickDisplay
              key={event.id}
              event={event}
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
  isATS = false,
}: LeaguePicksProps) {
  const navigate = useNavigate();
  const { leagueId } = routeApi.useParams();

  // Check if picks are locked for this phase
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
      events: [],
    });
  }

  phases.push(phase);

  if (phase.nextPhase) {
    phases.push({
      ...phase.nextPhase,
      previousPhase: phase,
      nextPhase: undefined,
      events: [],
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
  const members = Array.from(picksByUser.entries()).map(([, picks]) => {
    const firstPick = picks[0];
    const profile = firstPick.profile!;

    // Map picks to events
    const picksWithEvents = picks
      .map((pick) => {
        const event = phase.events?.find((e) => e.id === pick.eventId);
        return {
          event: event!,
          pick,
        };
      })
      .filter((item) => item.event); // Filter out picks without events

    return {
      profile,
      picks: picksWithEvents,
    };
  });

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
            This phase doesn't have any games yet.
          </p>
        </div>
      ) : !isPicksLocked ? (
        // Picks are not yet visible
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            League member picks will be visible after the pick lock time.
          </p>
        </div>
      ) : members.length === 0 ? (
        // No picks made yet
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No picks have been made for this phase yet.
          </p>
        </div>
      ) : (
        // Show member picks
        <div className="space-y-4">
          {members.map((member) => (
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
