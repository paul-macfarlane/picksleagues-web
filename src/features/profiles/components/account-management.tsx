import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { isSoleCommissioner } from "../profiles.utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetMyLeaguesQueryOptions } from "@/features/leagues/leagues.api";
import { useDeleteAccount } from "@/features/users/users.api";
import { LEAGUE_INCLUDES } from "@/features/leagues/leagues.types";

export function AccountManagement() {
  const [submitError, setSubmitError] = useState<string | undefined>();
  const navigate = useNavigate();
  const { data: leagues } = useSuspenseQuery(
    GetMyLeaguesQueryOptions([LEAGUE_INCLUDES.MEMBERS]),
  );
  const { data: session } = authClient.useSession();

  const soleCommissioner = isSoleCommissioner(leagues, session!.user.id);

  const deleteAccount = useDeleteAccount();

  const handleDelete = async () => {
    try {
      await deleteAccount.mutateAsync();
      await authClient.signOut();
      navigate({ to: "/", reloadDocument: true });
    } catch (error) {
      const errorMessage = "Failed to delete account";
      if (error instanceof Error) {
        setSubmitError(`${errorMessage}: ${error.message}`);
      } else {
        setSubmitError(errorMessage);
      }
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 rounded-lg border border-destructive/50 p-4">
            <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              This action is permanent and cannot be undone.
            </p>
            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}
            {soleCommissioner ? (
              <p className="text-sm text-destructive">
                You are the sole commissioner of at least one league. Please
                designate a new commissioner before deleting your account.
              </p>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="mt-2"
                    disabled={soleCommissioner}
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
