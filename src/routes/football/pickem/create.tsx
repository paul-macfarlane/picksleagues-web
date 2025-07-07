import {
  LEAGUE_TYPE_SLUGS,
  phaseTemplatesByLeagueTypeQueryOptions,
} from "@/api/leagueTypes";
import {
  createLeague,
  createPickEmLeagueSchema,
  type CreatePickEmLeague,
} from "@/api/leagues";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/components/form";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Enum values for selects
import {
  LEAGUE_VISIBILITIES,
  MIN_LEAGUE_SIZE,
  MAX_LEAGUE_SIZE,
} from "@/api/leagues";

export const Route = createFileRoute("/football/pickem/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: phaseTemplates,
    isLoading: isLoadingPhaseTemplates,
    isError: isErrorPhaseTemplates,
    error: phaseTemplatesError,
  } = useQuery(
    phaseTemplatesByLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      image: "",
      leagueTypeSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
      startPhaseTemplateId: "",
      endPhaseTemplateId: "",
      visibility: LEAGUE_VISIBILITIES.PRIVATE,
      size: MIN_LEAGUE_SIZE,
      settings: { picksPerPhase: 1 },
    } as CreatePickEmLeague,
    validators: {
      onSubmit: createPickEmLeagueSchema,
    },
    onSubmit: async (values) => {
      setSubmitError(undefined);
      setIsSubmitting(true);
      try {
        // todo this should probably use a mutation hook
        await createLeague(values.value);
        toast.success("League created successfully!");
        // todo this would navigate to the league page itself
        navigate({ to: "/" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Failed to create league");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isLoadingPhaseTemplates) {
    return (
      <div className="flex justify-center items-center p-4">
        Loading phase templates...
      </div>
    );
  }
  if (isErrorPhaseTemplates) {
    return (
      <div className="flex justify-center items-center p-4 text-destructive">
        Error loading phase templates:{" "}
        {phaseTemplatesError?.message || "Unknown error"}
      </div>
    );
  }

  // Responsive grid: 1 col on mobile, 2 cols on md+
  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Pick'em League</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {/* League Name + Avatar + Image URL (row) */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                {/* League Name */}
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
                          placeholder: "League name",
                          className: "w-full",
                        }}
                      />
                    )}
                  />
                </div>
                {/* Avatar + Image URL */}
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
                          <AvatarFallback>L</AvatarFallback>
                        </Avatar>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Start Phase Template */}
            <div className="col-span-1">
              <form.AppField
                name="startPhaseTemplateId"
                children={(field) => (
                  <field.SelectField
                    labelProps={{
                      htmlFor: "startPhaseTemplateId",
                      children: "Start Phase",
                    }}
                    options={
                      phaseTemplates?.map((pt) => ({
                        value: pt.id,
                        label: pt.label,
                      })) ?? []
                    }
                    placeholder="Select start phase"
                  />
                )}
              />
            </div>
            {/* End Phase Template */}
            <div className="col-span-1">
              <form.AppField
                name="endPhaseTemplateId"
                children={(field) => (
                  <field.SelectField
                    labelProps={{
                      htmlFor: "endPhaseTemplateId",
                      children: "End Phase",
                    }}
                    options={
                      phaseTemplates?.map((pt) => ({
                        value: pt.id,
                        label: pt.label,
                      })) ?? []
                    }
                    placeholder="Select end phase"
                  />
                )}
              />
            </div>
            {/* Visibility */}
            <div className="col-span-1">
              <form.AppField
                name="visibility"
                children={(field) => (
                  <field.SelectField
                    labelProps={{
                      htmlFor: "visibility",
                      children: "Visibility",
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
            {/* League Size */}
            <div className="col-span-1">
              <form.AppField
                name="size"
                children={(field) => (
                  <field.TextField
                    labelProps={{ htmlFor: "size", children: "League Size" }}
                    inputProps={{
                      id: "size",
                      type: "number",
                      min: MIN_LEAGUE_SIZE,
                      max: MAX_LEAGUE_SIZE,
                      className: "w-full",
                    }}
                  />
                )}
              />
            </div>
            {/* Picks Per Phase (settings) */}
            <div className="col-span-1">
              <form.AppField
                name="settings.picksPerPhase"
                children={(field) => (
                  <field.TextField
                    labelProps={{
                      htmlFor: "picksPerPhase",
                      children: "Picks Per Phase",
                    }}
                    inputProps={{
                      id: "picksPerPhase",
                      type: "number",
                      min: 1,
                      max: 16,
                      className: "w-full",
                    }}
                  />
                )}
              />
            </div>
            {/* Submit button (full width) */}
            <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-2">
              <form.AppForm>
                <form.SubmitButton
                  submiterror={submitError}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create League"}
                </form.SubmitButton>
              </form.AppForm>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
