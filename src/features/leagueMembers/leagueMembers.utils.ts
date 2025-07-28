import type { PopulatedLeagueResponse } from "../leagues/leagues.types";
import { LEAGUE_MEMBER_ROLES } from "./leagueMembers.types";

export function canRemoveMembers(
  userId: string,
  league: PopulatedLeagueResponse,
) {
  const currentUserMemberInfo = league.members?.find(
    (member) => member.userId === userId,
  );
  return (
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER &&
    !league.isInSeason
  );
}

export function canEditMemberRoles(
  userId: string,
  league: PopulatedLeagueResponse,
) {
  const currentUserMemberInfo = league.members?.find(
    (member) => member.userId === userId,
  );
  return currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
}

export function canLeaveLeagueAndIsSoleMember(
  userId: string,
  league: PopulatedLeagueResponse,
): {
  canLeave: boolean;
  isSoleMember: boolean;
} {
  const currentUserMemberInfo = league.members?.find(
    (member) => member.userId === userId,
  );
  const otherCommissioners = league.members?.filter(
    (member) =>
      member.userId !== userId &&
      member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER,
  );

  const isSoleMember = !!(
    currentUserMemberInfo && league.members?.length === 1
  );
  const isSoleCommissioner =
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER &&
    otherCommissioners?.length === 0;

  return {
    canLeave: !league.isInSeason && (isSoleMember || !isSoleCommissioner),
    isSoleMember,
  };
}
