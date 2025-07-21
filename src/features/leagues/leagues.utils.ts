import { LEAGUE_MEMBER_ROLES } from "../leagueMembers/leagueMembers.types";
import type { PopulatedLeagueResponse } from "./leagues.types";

export function canEditSettings(
  league: PopulatedLeagueResponse,
  userId: string,
): boolean {
  return !!league.members?.find(
    (member) =>
      member.userId === userId &&
      member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER,
  );
}

export function canEditAllSettings(
  league: PopulatedLeagueResponse,
  userId: string,
): boolean {
  return (
    !!league.members?.find(
      (member) =>
        member.userId === userId &&
        member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER,
    ) && !league.isInSeason
  );
}
