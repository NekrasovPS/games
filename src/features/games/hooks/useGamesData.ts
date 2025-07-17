import { useGetGamesQuery } from '../../../api/gamesApi';
import { useState, useEffect } from 'react';
import { Game } from '../../../types/game';

export const useGamesData = (page: number, limit: number) => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isFetching, isError } = useGetGamesQuery({ page, limit });

  useEffect(() => {
    if (!data) return;

    setAllGames((prev) => {
      const newGames = data.filter((game) => !prev.some((g) => g.gameID === game.gameID));
      return [...prev, ...newGames];
    });

    setHasMore(data.length >= limit);
    if (isError) setHasMore(false);
  }, [data, limit, isError]);

  return { allGames, hasMore, isFetching, isError };
};

// Добавляем явный экспорт
export {};
