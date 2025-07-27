import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UpdatePickEmLeagueSchema,
  type PopulatedPickEmLeagueResponse,
  LEAGUE_VISIBILITIES,
  PICK_EM_PICK_TYPES,
  PICK_EM_PICK_TYPE_LABELS,
} from "@/features/leagues/leagues.types";
import { useAppForm } from "@/components/form";
import { DeleteLeagueDialog } from "./delete-league-dialog";
import { useState } from "react";
import { useUpdateLeague } from "../leagues.api";
import type { z } from "zod";
import type { PhaseTemplateResponse } from "@/features/phaseTemplates/phaseTemplates.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

type LeagueSettingsFormProps = {
  league: PopulatedPickEmLeagueResponse;
  canEditSettings: boolean;
  canEditAllSettings: boolean;
  phaseTemplates: PhaseTemplateResponse[];
};

// TODO: this is tightly coupled to pick'em leagues right now, not an issue yet but will have to update
export function LeagueSettingsForm({
  league,
  canEditSettings,
  canEditAllSettings,
  phaseTemplates,
}: LeagueSettingsFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const { mutateAsync: updateLeague } = useUpdateLeague();

  const form = useAppForm({
    validators: {
      onSubmit: UpdatePickEmLeagueSchema,
    },
    defaultValues: {
      ...league,
      image: league.image || undefined,
      settings: {
        ...league.settings,
      },
    } as z.infer<typeof UpdatePickEmLeagueSchema>,
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(undefined);

        const startPhaseTemplate = phaseTemplates?.find(
          (pt) => pt.id === value.startPhaseTemplateId,
        );
        const endPhaseTemplate = phaseTemplates?.find(
          (pt) => pt.id === value.endPhaseTemplateId,
        );
        if (
          startPhaseTemplate?.sequence &&
          endPhaseTemplate?.sequence &&
          startPhaseTemplate.sequence > endPhaseTemplate.sequence
        ) {
          setSubmitError("Start week must be before end week");
          return;
        }

        if (
          value.size &&
          league.members &&
          value.size < league.members.length
        ) {
          setSubmitError(
            `League size cannot be smaller than the current number of members (${
              league.members.length
            })`,
          );
          return;
        }

        if (canEditAllSettings) {
          await updateLeague({
            leagueId: league.id,
            league: value,
            leagueTypeSlug: league.leagueType!.slug,
          });
        } else {
          await updateLeague({
            leagueId: league.id,
            league: {
              name: value.name,
              image: value.image,
            },
            leagueTypeSlug: league.leagueType!.slug,
          });
        }
        toast.success("League settings updated");
      } catch (error) {
        const errorMessage = "Failed to update league settings";
        if (error instanceof Error) {
          setSubmitError(`${errorMessage}: ${error.message}`);
        } else {
          setSubmitError(errorMessage);
        }
      }
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
          setSubmitError(undefined);
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>League Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start w-full">
              <div className="w-full md:w-1/2">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.TextField
                      labelProps={{ children: "League Name" }}
                      inputProps={{
                        type: "text",
                        disabled: !canEditSettings,
                      }}
                    />
                  )}
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex w-full items-start gap-2">
                  <div className="flex-1">
                    <form.AppField
                      name="image"
                      children={(field) => (
                        <field.TextField
                          labelProps={{ children: "Logo URL" }}
                          inputProps={{
                            type: "text",
                            disabled: !canEditSettings,
                          }}
                        />
                      )}
                    />
                  </div>
                  <form.Subscribe
                    selector={(state) => state.values.image}
                    children={(imageUrl) => (
                      <Avatar className="h-10 w-10 mt-5">
                        <AvatarImage
                          src={imageUrl || undefined}
                          alt="League preview"
                        />
                        <AvatarFallback>
                          <Trophy className="w-4 h-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.AppField
                name="startPhaseTemplateId"
                children={(field) => (
                  <field.SelectField
                    selectProps={{
                      name: "startPhaseTemplateId",
                      disabled: !canEditAllSettings,
                    }}
                    selectTriggerProps={{
                      id: "startPhaseTemplateId",
                    }}
                    labelProps={{
                      htmlFor: "startPhaseTemplateId",
                      children: "Start Week",
                    }}
                    options={
                      phaseTemplates?.map((pt) => ({
                        value: pt.id,
                        label: pt.label,
                      })) ?? []
                    }
                    placeholder="Select start week"
                  />
                )}
              />
              <form.AppField
                name="endPhaseTemplateId"
                children={(field) => (
                  <field.SelectField
                    selectProps={{
                      name: "endPhaseTemplateId",
                      disabled: !canEditAllSettings,
                    }}
                    selectTriggerProps={{
                      id: "endPhaseTemplateId",
                    }}
                    labelProps={{
                      htmlFor: "endPhaseTemplateId",
                      children: "End Week",
                    }}
                    options={
                      phaseTemplates?.map((pt) => ({
                        value: pt.id,
                        label: pt.label,
                      })) ?? []
                    }
                    placeholder="Select end week"
                  />
                )}
              />
              <form.AppField
                name="visibility"
                children={(field) => (
                  <field.SelectField
                    labelProps={{
                      htmlFor: "visibility",
                      children: "Visibility",
                    }}
                    selectProps={{
                      name: "visibility",
                      disabled: !canEditAllSettings,
                    }}
                    selectTriggerProps={{
                      id: "visibility",
                    }}
                    options={[
                      {
                        value: LEAGUE_VISIBILITIES.PRIVATE,
                        label: "Private",
                      },
                      {
                        value: "public",
                        label: "Public (coming soon)",
                        disabled: true,
                      },
                    ]}
                    placeholder="Select visibility"
                  />
                )}
              />
              <form.AppField
                name="size"
                children={(field) => (
                  <field.NumberField
                    labelProps={{ children: "League Size" }}
                    inputProps={{
                      disabled: !canEditAllSettings,
                    }}
                  />
                )}
              />
              <form.AppField
                name="settings.picksPerPhase"
                children={(field) => (
                  <field.NumberField
                    labelProps={{ children: "Picks Per Week" }}
                    inputProps={{
                      disabled: !canEditAllSettings,
                    }}
                  />
                )}
              />
              <form.AppField
                name="settings.pickType"
                children={(field) => (
                  <field.SelectField
                    labelProps={{
                      htmlFor: "settings.pickType",
                      children: "Pick Type",
                    }}
                    selectProps={{
                      name: "settings.pickType",
                      disabled: !canEditAllSettings,
                    }}
                    selectTriggerProps={{
                      id: "settings.pickType",
                    }}
                    options={Object.values(PICK_EM_PICK_TYPES).map((v) => ({
                      value: v,
                      label: PICK_EM_PICK_TYPE_LABELS[v],
                    }))}
                  />
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
            >
              Delete League
            </Button>

            <form.AppForm>
              <form.SubmitButton submiterror={submitError}>
                Save Changes
              </form.SubmitButton>
            </form.AppForm>
          </CardFooter>
        </Card>
      </form>
      <DeleteLeagueDialog
        leagueId={league.id}
        leagueTypeSlug={league.leagueType!.slug}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
