import {
  LEAGUE_MEMBER_ROLES,
  type PopulatedLeagueMemberResponse,
} from "./leagueMembers.types";

export function canManageMembers(
  userId: string,
  members: PopulatedLeagueMemberResponse[],
) {
  const currentUserMemberInfo = members.find(
    (member) => member.userId === userId,
  );
  return currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
}
