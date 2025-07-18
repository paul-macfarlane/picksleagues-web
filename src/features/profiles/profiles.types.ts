// constants

import z from "zod";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 50;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

// api types

export type ProfileResponse = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// schemas

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, {
      message: `Must be at least ${MIN_USERNAME_LENGTH} characters`,
    })
    .max(MAX_USERNAME_LENGTH, {
      message: `Must be at most ${MAX_USERNAME_LENGTH} characters`,
    }),
  firstName: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `Required` })
    .max(MAX_NAME_LENGTH, {
      message: `Must be at most ${MAX_NAME_LENGTH} characters`,
    }),
  lastName: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `Required` })
    .max(MAX_NAME_LENGTH, {
      message: `Must be at most ${MAX_NAME_LENGTH} characters`,
    }),
  avatarUrl: z.union([
    z.string().trim().url().optional(),
    z.literal(""),
    z.null(),
  ]),
});

export const SearchProfilesSchema = z.object({
  username: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
});
