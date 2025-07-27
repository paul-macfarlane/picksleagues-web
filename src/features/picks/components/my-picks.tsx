import { useState } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PickDisplay } from "./pick-display";
import { InteractivePickDisplay } from "./interactive-pick-display";
import { WeekSwitcher } from "./week-switcher";
import type { PopulatedPickResponse } from "../picks.types";
import type { PopulatedPhaseResponse } from "../../phases/phases.types";

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

  const handlePick = (eventId: string, teamId: string) => {
    setSelectedPicks((prev) => ({
      ...prev,
      [eventId]: teamId,
    }));
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

  // Filter events that haven't started yet for pick making
  const currentEvents = phase.events || [];
  const pickableEvents = currentEvents.filter(
    (event) => !event.liveScore && !event.outcome,
  );

  const requiredPicks = Math.min(pickableEvents.length, 5); // Assuming 5 picks per week
  const hasEnoughPicks = Object.keys(selectedPicks).length >= requiredPicks;

  return (
    <div className="space-y-6">
      <WeekSwitcher
        phases={phases}
        selectedPhaseId={phase.id}
        onSelect={handlePhaseSelect}
        disableFuture={true}
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
        <div className="space-y-4">
          {pickableEvents.map((event) => (
            <InteractivePickDisplay
              key={event.id}
              event={event}
              userPick={userPickMap.get(event.id)}
              isATS={isATS}
              onPick={(teamId) => handlePick(event.id, teamId)}
            />
          ))}

          {pickableEvents.length > 0 && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmitPicks}
                disabled={!hasEnoughPicks}
                className="px-8"
              >
                Submit Picks ({Object.keys(selectedPicks).length}/
                {requiredPicks})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
