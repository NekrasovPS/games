import { Game } from '../../../types/game';

export const filterGames = (games: Game[], searchTerm: string, gameTypeFilter: string): Game[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return games.filter((game) => {
    const matchesSearch = game.gameName.toLowerCase().includes(normalizedSearch);
    const matchesType = gameTypeFilter ? game.gameTypeID === gameTypeFilter : true;

    return matchesSearch && matchesType;
  });
};
