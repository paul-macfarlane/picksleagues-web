import { useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/components/form";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import type { PhaseTemplateResponse } from "@/features/phaseTemplates/phaseTemplates.types";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { useCreateLeague } from "@/features/leagues/leagues.api";
import type z from "zod";
import {
  LEAGUE_VISIBILITIES,
  MIN_PICKS_PER_PHASE,
  PICK_EM_PICK_TYPES,
  CreatePickEmLeagueSchema,
  PICK_EM_PICK_TYPE_LABELS,
  DEFAULT_LEAGUE_SIZE,
} from "@/features/leagues/leagues.types";

type CreateLeagueFormProps = {
  phaseTemplates: PhaseTemplateResponse[];
};

// TODO right now, this is only for pick em leagues and tightly coupled to the pick em league type
export function CreateLeagueForm({ phaseTemplates }: CreateLeagueFormProps) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const { mutateAsync: createLeague } =
    useCreateLeague<z.infer<typeof CreatePickEmLeagueSchema>>();

  const form = useAppForm({
    defaultValues: {
      name: "",
      image: "",
      leagueTypeSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
      startPhaseTemplateId: phaseTemplates?.[0]?.id ?? "",
      endPhaseTemplateId: phaseTemplates?.at(-1)?.id ?? "",
      visibility: LEAGUE_VISIBILITIES.PRIVATE,
      size: DEFAULT_LEAGUE_SIZE,
      settings: {
        picksPerPhase: Number(MIN_PICKS_PER_PHASE),
        pickType: PICK_EM_PICK_TYPES.SPREAD,
      },
    } as z.infer<typeof CreatePickEmLeagueSchema>,
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
              selectProps={{
                name: "startPhaseTemplateId",
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
              selectProps={{
                name: "endPhaseTemplateId",
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
              options={Object.values(LEAGUE_VISIBILITIES).map((v) => ({
                value: v,
                label: v,
              }))}
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
                name: "size",
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
                children: "Picks per Week",
              }}
              inputProps={{
                id: "settings.picksPerPhase",
                name: "settings.picksPerPhase",
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
              options={Object.values(PICK_EM_PICK_TYPES).map((v) => ({
                value: v,
                label: PICK_EM_PICK_TYPE_LABELS[v],
              }))}
            />
          )}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <form.AppForm>
          <form.SubmitButton
            className="w-full"
            submiterror={submitError}
            children="Create League"
          />
        </form.AppForm>
      </div>
    </form>
  );
}
