export interface Game {
  gameID: string;
  gameName: string;
  gameTypeID: string;
  technology?: string;
  platform?: string;
}

export type GameFilterCriteria = {
  searchTerm: string;
  gameType: string;
};
