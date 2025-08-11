import { useState } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PickDisplay } from "./pick-display";
import { InteractivePickDisplay } from "./interactive-pick-display";
import { WeekSwitcher } from "./week-switcher";
import type { PopulatedPickResponse } from "../picks.types";
import type { PopulatedPhaseResponse } from "../../phases/phases.types";
import { LIVE_SCORE_STATUSES } from "../../events/events.type";
import { useSubmitPicksMutation } from "../picks.api";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

interface MyPicksProps {
  phase: PopulatedPhaseResponse;
  userPicks: PopulatedPickResponse[];
  picksPerPhase: number;
  isATS?: boolean;
}

const routeApi = getRouteApi(
  "/_authenticated/football/pick-em/$leagueId/my-picks",
);

export function MyPicks({
  phase,
  userPicks,
  picksPerPhase,
  isATS = false,
}: MyPicksProps) {
  const navigate = useNavigate();
  const { leagueId } = routeApi.useParams();
  const [selectedPicks, setSelectedPicks] = useState<Record<string, string>>(
    {},
  );
  const { mutate: submitPicksMutation, isPending: isSubmittingPicks } =
    useSubmitPicksMutation();

  // Determine if this is the current phase based on start/end dates
  const now = new Date();
  const phaseStart = new Date(phase.startDate);
  const phaseEnd = new Date(phase.endDate);
  const pickLockTime = new Date(phase.pickLockTime);
  const isCurrentPhase = now >= phaseStart && now <= phaseEnd;
  const isPicksLocked = now >= pickLockTime;

  // Check if user has made picks for this phase
  const hasMadePicks = userPicks.length > 0;

  // Filter events that haven't started yet for pick making
  const currentEvents = phase.events || [];
  const pickableEvents = currentEvents.filter((event) => {
    // If there's an outcome, the game is finished
    if (event.outcome) return false;

    // If there's a live score, check its status
    if (event.liveScore) {
      // If status is not "in_progress", the game hasn't started yet
      return event.liveScore.status !== LIVE_SCORE_STATUSES.IN_PROGRESS;
    }

    // No outcome and no live score means game hasn't started
    return true;
  });

  const requiredPicks = Math.min(pickableEvents.length, picksPerPhase);

  // Check if there are any events at all in this phase
  const hasAnyEvents = currentEvents.length > 0;

  const handlePick = (eventId: string, teamId: string) => {
    setSelectedPicks((prev) => {
      if (teamId === "") {
        // Remove the pick if teamId is empty
        const newPicks = { ...prev };
        delete newPicks[eventId];
        return newPicks;
      } else {
        // Check if we're already at the maximum number of picks
        const currentPickCount = Object.keys(prev).length;
        const isAlreadySelected = prev[eventId];

        // If we're at max picks and this isn't already selected, don't allow selection
        if (currentPickCount >= requiredPicks && !isAlreadySelected) {
          return prev;
        }

        // Add or update the pick
        return {
          ...prev,
          [eventId]: teamId,
        };
      }
    });
  };

  const handleSubmitPicks = () => {
    const picks = Object.entries(selectedPicks).map(([eventId, teamId]) => ({
      eventId,
      teamId,
    }));

    submitPicksMutation(
      {
        leagueId,
        phaseId: phase.id,
        picks: { picks },
      },
      {
        onSuccess: () => {
          toast.success("Picks submitted successfully!");
          setSelectedPicks({});
        },
        onError: (e) => {
          const error = e as Error;
          toast.error(`Failed to submit picks. ${error.message}`);
        },
      },
    );
  };

  const handlePhaseSelect = (phaseId: string) => {
    // Navigate to the new phase
    navigate({
      to: "/football/pick-em/$leagueId/my-picks",
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

  const hasEnoughPicks = Object.keys(selectedPicks).length >= requiredPicks;

  return (
    <div className="space-y-6">
      <WeekSwitcher
        phases={phases}
        selectedPhaseId={phase.id}
        onSelect={handlePhaseSelect}
      />

      {!hasAnyEvents ? (
        // No events in this phase
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            This week doesn't have any games yet.
          </p>
        </div>
      ) : hasMadePicks ? (
        // Show only the events where user made picks
        <div className="space-y-4">
          {userPicks.map((userPick) => {
            const event = currentEvents.find((e) => e.id === userPick.eventId);
            if (!event) return null; // Skip if event not found

            return (
              <PickDisplay
                key={event.id}
                event={event}
                userPick={userPick}
                isATS={isATS}
              />
            );
          })}
        </div>
      ) : !isCurrentPhase ? (
        // Not current phase - show read-only view
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              This week hasn't started yet. Picks will be available when it
              becomes the current phase.
            </p>
          </div>
          {currentEvents.map((event) => (
            <PickDisplay
              key={event.id}
              event={event}
              userPick={undefined}
              isATS={isATS}
            />
          ))}
        </div>
      ) : (
        // Show interactive pick making for current phase
        <>
          {/* Pick lock time warning */}
          <Alert
            className="mb-6"
            variant={isPicksLocked ? "destructive" : "default"}
          >
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              {isPicksLocked ? (
                <span className="font-semibold">
                  Picks are now locked for this phase.
                </span>
              ) : (
                <span>
                  Picks will lock at{" "}
                  <span className="font-semibold">
                    {pickLockTime.toLocaleString()}
                  </span>
                  . Make sure to submit your picks before then!
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Sticky submit button header */}
          {pickableEvents.length > 0 && !isPicksLocked && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pb-4 mb-4">
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitPicks}
                  disabled={!hasEnoughPicks || isSubmittingPicks}
                  className="px-8"
                  size="lg"
                >
                  {isSubmittingPicks
                    ? "Submitting..."
                    : `Submit Picks (${Object.keys(selectedPicks).length}/${requiredPicks})`}
                </Button>
              </div>
            </div>
          )}

          {/* Interactive pick making - only show if picks aren't locked */}
          {!isPicksLocked ? (
            <div className="space-y-4">
              {pickableEvents.length > 0 ? (
                pickableEvents.map((event) => (
                  <InteractivePickDisplay
                    key={event.id}
                    event={event}
                    isATS={isATS}
                    onPick={(teamId) => handlePick(event.id, teamId)}
                    selectedTeamId={selectedPicks[event.id]}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No games available for picks at this time.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Show message if picks are locked */
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2">
                  Picks are locked for this phase
                </p>
                <p>
                  You can no longer make picks for this phase. Picks locked at{" "}
                  {pickLockTime.toLocaleString()}.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
