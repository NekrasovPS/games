import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styles from './GameList.module.scss';
import { GameFilters } from '../../../components/GameFilters/GameFilters';
import { Loader } from '../../../components/Loader/Loader';
import { GameCard } from '../../../components/GameCard/GameCard';
import { usePaginatedGames } from './usePaginatedGames';
import { useFilteredGames } from './useFilteredGames';

const GameList: React.FC = () => {
  const limit = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('');
  const loaderRef = useRef<HTMLDivElement>(null);

  const { allGames, isFetching, isError, error, hasMore, nextPage } = usePaginatedGames(limit);

  const filteredGames = useFilteredGames(allGames, searchTerm, gameTypeFilter);

  const gameTypes = useMemo(() => {
    return Array.from(new Set(allGames.map((g) => g.gameTypeID))).sort();
  }, [allGames]);

  const handleObserver = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasMore && !isFetching) {
        nextPage();
      }
    },
    [hasMore, isFetching, nextPage],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '20px',
      threshold: 0.1,
    });

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current); // ✅ проверка внутри
    };
  }, [handleObserver]);

  if (isError) return <div className={styles.error}>Error loading games: {String(error)}</div>;
  if (!isFetching && filteredGames.length === 0)
    return <div className={styles.empty}>No games found</div>;

  return (
    <div className={styles.container}>
      <GameFilters
        searchTerm={searchTerm}
        gameTypeFilter={gameTypeFilter}
        gameTypes={gameTypes}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setGameTypeFilter}
      />
      <div className={styles.grid}>
        {filteredGames.map((game) => (
          <GameCard key={game.gameID} game={game} />
        ))}
      </div>
      <div ref={loaderRef} className={styles.loader}>
        {isFetching && <Loader />}
        {!hasMore && !isFetching && <div className={styles.endMessage}>No more games</div>}
      </div>
    </div>
  );
};

export default React.memo(GameList);
