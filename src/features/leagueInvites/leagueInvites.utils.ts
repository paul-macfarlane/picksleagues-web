import type { PopulatedLeagueMemberResponse } from "@/features/leagueMembers/leagueMembers.types";
import { LEAGUE_MEMBER_ROLES } from "@/features/leagueMembers/leagueMembers.types";
import type { LeagueResponse } from "@/features/leagues/leagues.types";

export function canManageInvites(
  userId: string,
  league: LeagueResponse,
  members: PopulatedLeagueMemberResponse[],
) {
  const currentUserMemberInfo = members.find(
    (member) => member.userId === userId,
  );
  return (
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER &&
    members.length < league.size
  );
}
