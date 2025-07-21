import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteLeague } from "../leagues.api";
import { useNavigate } from "@tanstack/react-router";
import type { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { toast } from "sonner";

interface DeleteLeagueDialogProps {
  leagueId: string;
  leagueTypeSlug: LEAGUE_TYPE_SLUGS;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteLeagueDialog({
  leagueId,
  leagueTypeSlug,
  open,
  onOpenChange,
}: DeleteLeagueDialogProps) {
  const navigate = useNavigate();
  const { mutate: deleteLeague, isPending } = useDeleteLeague();

  const handleDelete = () => {
    deleteLeague(
      { leagueId, leagueTypeSlug },
      {
        onSuccess: () => {
          onOpenChange(false);
          navigate({ to: "/football/pick-em" });
          toast.success("League deleted successfully");
        },
        onError: (error) => {
          toast.error(`Failed to delete league: ${error.message}`);
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            league and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
