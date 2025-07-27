import type { PopulatedPhaseResponse } from "../../phases/phases.types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function WeekSwitcher({
  phases,
  selectedPhaseId,
  onSelect,
  disableFuture = false,
}: {
  phases: PopulatedPhaseResponse[];
  selectedPhaseId: string;
  onSelect: (id: string) => void;
  disableFuture?: boolean;
}) {
  const selectedIndex = phases.findIndex((p) => p.id === selectedPhaseId);
  const selectedPhase = phases[selectedIndex];

  const canGoBack = selectedIndex > 0;
  const canGoForward = selectedIndex < phases.length - 1;

  const handlePrevious = () => {
    if (canGoBack) {
      onSelect(phases[selectedIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      onSelect(phases[selectedIndex + 1].id);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={!canGoBack}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="font-bold text-lg min-w-[8rem] text-center">
        {selectedPhase ? `Week ${selectedPhase.sequence}` : "Select Week"}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={
          !canGoForward ||
          (disableFuture &&
            selectedPhase?.startDate &&
            new Date(selectedPhase.startDate) > new Date())
        }
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
