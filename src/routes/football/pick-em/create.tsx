import {
  LEAGUE_TYPE_SLUGS,
  MY_LEAGUES_FOR_LEAGUE_TYPE_QUERY_KEY,
  phaseTemplatesByLeagueTypeQueryOptions,
} from "@/api/leagueTypes";
import {
  useCreateLeague,
  CreatePickEmLeagueSchema,
  MIN_PICKS_PER_PHASE,
  type CreatePickEmLeague,
  PICK_EM_PICK_TYPES,
  PICK_EM_PICK_TYPE_LABELS,
} from "@/api/leagues";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/components/form";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { LEAGUE_VISIBILITIES, MIN_LEAGUE_SIZE } from "@/api/leagues";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/football/pick-em/create")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const {
    data: phaseTemplates,
    isLoading: isLoadingPhaseTemplates,
    isError: isErrorPhaseTemplates,
    error: phaseTemplatesError,
  } = useQuery(
    phaseTemplatesByLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
  );
  const { mutateAsync: createLeague } = useCreateLeague<CreatePickEmLeague>();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      image: "",
      leagueTypeSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
      startPhaseTemplateId: phaseTemplates?.[0]?.id ?? "",
      endPhaseTemplateId: phaseTemplates?.at(-1)?.id ?? "",
      visibility: LEAGUE_VISIBILITIES.PRIVATE,
      size: MIN_LEAGUE_SIZE,
      settings: {
        picksPerPhase: Number(MIN_PICKS_PER_PHASE),
        pickType: PICK_EM_PICK_TYPES.SPREAD,
      },
    } as CreatePickEmLeague,
    validators: {
      onSubmit: CreatePickEmLeagueSchema,
    },
    onSubmit: async (values) => {
      const startPhaseTemplate = phaseTemplates?.find(
        (pt) => pt.id === values.value.startPhaseTemplateId,
      );
      const endPhaseTemplate = phaseTemplates?.find(
        (pt) => pt.id === values.value.endPhaseTemplateId,
      );
      if (
        startPhaseTemplate?.sequence &&
        endPhaseTemplate?.sequence &&
        startPhaseTemplate.sequence > endPhaseTemplate.sequence
      ) {
        setSubmitError("Start week must be before end week");
        return;
      }

      try {
        const league = await createLeague(values.value);
        toast.success("League created successfully!");
        queryClient.invalidateQueries({
          queryKey: MY_LEAGUES_FOR_LEAGUE_TYPE_QUERY_KEY(
            LEAGUE_TYPE_SLUGS.PICK_EM,
          ),
        });
        navigate({
          to: "/football/pick-em/$leagueId",
          params: { leagueId: league.id },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Failed to create league");
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Pick'em League</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
              setSubmitError(undefined);
            }}
          >
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                <div className="w-full md:w-1/2">
                  <form.AppField
                    name="name"
                    children={(field) => (
                      <field.TextField
                        labelProps={{
                          htmlFor: "name",
                          children: "League Name",
                        }}
                        inputProps={{
                          id: "name",
                          name: "name",
                          placeholder: "League name",
                          className: "w-full",
                          autoComplete: "off",
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
                            labelProps={{
                              htmlFor: "image",
                              children: "Image URL",
                            }}
                            inputProps={{
                              id: "image",
                              name: "image",
                              placeholder: "https://...",
                              className: "w-full",
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
            </div>
            <div className="col-span-1">
              <form.AppField
                name="startPhaseTemplateId"
                children={(field) => (
                  <field.SelectField
                    externalError={
                      isErrorPhaseTemplates
                        ? phaseTemplatesError?.message
                        : undefined
                    }
                    selectProps={{
                      disabled: isLoadingPhaseTemplates,
                      name: "endPhaseTemplateId",
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
            </div>
            <div className="col-span-1">
              <form.AppField
                name="endPhaseTemplateId"
                children={(field) => (
                  <field.SelectField
                    externalError={
                      isErrorPhaseTemplates
                        ? phaseTemplatesError?.message
                        : undefined
                    }
                    selectProps={{
                      disabled: isLoadingPhaseTemplates,
                      name: "startPhaseTemplateId",
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
            </div>
            <div className="col-span-1">
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
                    }}
                    selectTriggerProps={{
                      id: "visibility",
                    }}
                    options={[
                      ...Object.values(LEAGUE_VISIBILITIES).map((v) => ({
                        value: v,
                        label: v.charAt(0).toUpperCase() + v.slice(1),
                      })),
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
            </div>
            <div className="col-span-1">
              <form.AppField
                name="size"
                children={(field) => (
                  <field.NumberField
                    labelProps={{
                      htmlFor: "size",
                      children: "League Size",
                    }}
                    inputProps={{
                      id: "size",
                      type: "number",
                      placeholder: MIN_LEAGUE_SIZE.toString(),
                      className: "w-full",
                      onChange: (e) =>
                        field.handleChange(Number(e.target.value)),
                    }}
                  />
                )}
              />
            </div>
            <div className="col-span-1">
              <form.AppField
                name="settings.picksPerPhase"
                children={(field) => (
                  <field.NumberField
                    labelProps={{
                      htmlFor: "settings.picksPerPhase",
                      children: "Picks Per Week",
                    }}
                    inputProps={{
                      id: "settings.picksPerPhase",
                      type: "number",
                      placeholder: MIN_PICKS_PER_PHASE.toString(),
                      className: "w-full",
                      onChange: (e) =>
                        field.handleChange(Number(e.target.value)),
                    }}
                  />
                )}
              />
            </div>
            <div className="col-span-1">
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
                    }}
                    selectTriggerProps={{
                      id: "settings.pickType",
                    }}
                    options={[
                      {
                        value: PICK_EM_PICK_TYPES.STRAIGHT_UP,
                        label:
                          PICK_EM_PICK_TYPE_LABELS[
                            PICK_EM_PICK_TYPES.STRAIGHT_UP
                          ],
                      },
                      {
                        value: PICK_EM_PICK_TYPES.SPREAD,
                        label:
                          PICK_EM_PICK_TYPE_LABELS[PICK_EM_PICK_TYPES.SPREAD],
                      },
                    ]}
                    placeholder="Select pick type"
                  />
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-2">
              <form.AppForm>
                <form.SubmitButton
                  submiterror={submitError}
                  children="Create League"
                />
              </form.AppForm>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
