import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useGetGamesQuery } from '../api/gamesApi';
import { Game } from '../types/game';

export const useGames = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const [searchTerm, setSearchTerm] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('');
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: games = [], isFetching, isError, error } = useGetGamesQuery({ page, limit });

  useEffect(() => {
    if (isError) {
      setHasMore(false);
      return;
    }

    if (games.length === 0 && page > 1) {
      setHasMore(false);
      return;
    }

    setAllGames((prev) => {
      const newGames = games.filter((game) => !prev.some((g) => g.gameID === game.gameID));
      if (newGames.length === 0) return prev;
      return [...prev, ...newGames];
    });

    setHasMore(games.length >= limit);
  }, [games, limit, isError, page]);

  const gameTypes = useMemo(() => {
    const types = new Set<string>();
    allGames.forEach((game) => types.add(game.gameTypeID));
    return Array.from(types).sort();
  }, [allGames]);

  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const matchesSearch = game.gameName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = gameTypeFilter ? game.gameTypeID === gameTypeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [allGames, searchTerm, gameTypeFilter]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const filtersActive = searchTerm !== '' || gameTypeFilter !== '';
      if (entry.isIntersecting && hasMore && !isFetching && !filtersActive) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isFetching, searchTerm, gameTypeFilter],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    });

    const currentLoader = observerRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  return {
    filteredGames,
    gameTypes,
    searchTerm,
    gameTypeFilter,
    isFetching,
    isError,
    error,
    observerRef,
    setSearchTerm,
    setGameTypeFilter,
    hasMore,
  };
};
