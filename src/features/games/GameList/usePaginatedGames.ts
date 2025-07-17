import { useState, useEffect } from 'react';
import { useGetGamesQuery } from '../../../api/gamesApi';
import { Game } from '../../../types/game';

export const usePaginatedGames = (limit = 20) => {
  const [page, setPage] = useState(1);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: games = [], isFetching, isError, error } = useGetGamesQuery({ page, limit });

  useEffect(() => {
    if (isError || (games.length === 0 && page > 1)) {
      setHasMore(false);
      return;
    }

    setAllGames((prev) => {
      const newGames = games.filter((g) => !prev.some((p) => p.gameID === g.gameID));
      return [...prev, ...newGames];
    });

    setHasMore(games.length >= limit);
  }, [games, page, isError]);

  const nextPage = () => setPage((prev) => prev + 1);

  return {
    allGames,
    isFetching,
    isError,
    error,
    hasMore,
    nextPage,
  };
};
