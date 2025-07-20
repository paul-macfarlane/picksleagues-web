import type { PopulatedLeagueResponse } from "@/features/leagues/leagues.types";
import { LEAGUE_MEMBER_ROLES } from "@/features/leagueMembers/leagueMembers.types";

export function isSoleCommissioner(
  leagues: PopulatedLeagueResponse[],
  userId: string,
): boolean {
  for (const league of leagues) {
    if (league.members && league.members.length > 1) {
      const commissioners = league.members.filter(
        (member) => member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER,
      );
      if (commissioners.length === 1 && commissioners[0].userId === userId) {
        return true;
      }
    }
  }

  return false;
}
