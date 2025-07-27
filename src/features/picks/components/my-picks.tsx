import { useState } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PickDisplay } from "./pick-display";
import { InteractivePickDisplay } from "./interactive-pick-display";
import { WeekSwitcher } from "./week-switcher";
import type { PopulatedPickResponse } from "../picks.types";
import type { PopulatedPhaseResponse } from "../../phases/phases.types";
import { LIVE_SCORE_STATUSES } from "../../events/events.type";

interface MyPicksProps {
  phase: PopulatedPhaseResponse;
  userPicks: PopulatedPickResponse[];
  isATS?: boolean;
}

const routeApi = getRouteApi(
  "/_authenticated/football/pick-em/$leagueId/my-picks",
);

export function MyPicks({ phase, userPicks, isATS = false }: MyPicksProps) {
  const navigate = useNavigate();
  const { leagueId } = routeApi.useParams();
  const [selectedPicks, setSelectedPicks] = useState<Record<string, string>>(
    {},
  );

  // Check if user has made picks for this phase
  const hasMadePicks = userPicks.length > 0;

  // Create a map of event ID to user pick for easy lookup
  const userPickMap = new Map(userPicks.map((pick) => [pick.eventId, pick]));

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

  const requiredPicks = Math.min(pickableEvents.length, 5); // Assuming 5 picks per week

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
    // TODO: Implement submit picks logic
    console.log("Submitting picks:", selectedPicks);
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

      {hasMadePicks ? (
        // Show existing picks
        <div className="space-y-4">
          {currentEvents.map((event) => {
            const userPick = userPickMap.get(event.id);
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
      ) : (
        // Show interactive pick making
        <>
          {/* Sticky submit button header */}
          {pickableEvents.length > 0 && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pb-4 mb-4">
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitPicks}
                  disabled={!hasEnoughPicks}
                  className="px-8"
                  size="lg"
                >
                  Submit Picks ({Object.keys(selectedPicks).length}/
                  {requiredPicks})
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {pickableEvents.map((event) => (
              <InteractivePickDisplay
                key={event.id}
                event={event}
                isATS={isATS}
                onPick={(teamId) => handlePick(event.id, teamId)}
                selectedTeamId={selectedPicks[event.id]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
