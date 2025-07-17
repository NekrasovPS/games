import { useMemo } from 'react';
import { Game } from '../../../types/game';

export const useFilteredGames = (games: Game[], searchTerm: string, gameType: string) => {
  return useMemo(() => {
    return games.filter((game) => {
      const matchSearch = game.gameName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = gameType ? game.gameTypeID === gameType : true;
      return matchSearch && matchType;
    });
  }, [games, searchTerm, gameType]);
};
