export type TeamResponse = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  sportLeagueId: string;
  location: string;
  abbreviation: string;
  imageLight: string | null;
  imageDark: string | null;
};
