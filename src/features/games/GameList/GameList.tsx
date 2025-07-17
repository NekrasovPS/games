import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useGetGamesQuery } from '../../../api/gamesApi';
import { Game } from '../../../types/game';
import { GameFilters } from '../../../components/GameFilters/GameFilters';
import { Loader } from '../../../components/Loader/Loader';
import styles from './GameList.module.scss';
import { GameCard } from '../../../components/GameCard/GameCard';

const GameList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('');

  // Получаем данные с автоматической трансформацией через RTK Query
  const {
    data: games = [],
    isFetching,
    isError,
    error,
  } = useGetGamesQuery({
    page,
    limit,
  });

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Обработка новых данных
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
      // Фильтрация дубликатов
      const newGames = games.filter((game) => !prev.some((g) => g.gameID === game.gameID));
      return [...prev, ...newGames];
    });

    // Проверяем, есть ли еще данные для загрузки
    setHasMore(games.length >= limit);
  }, [games, limit, isError, page]);

  // Получаем уникальные типы игр для фильтра
  const gameTypes = useMemo(() => {
    const types = new Set<string>();
    allGames.forEach((game) => types.add(game.gameTypeID));
    return Array.from(types).sort();
  }, [allGames]);

  // Фильтрация игр по поиску и типу
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const matchesSearch = game.gameName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = gameTypeFilter ? game.gameTypeID === gameTypeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [allGames, searchTerm, gameTypeFilter]);

  // Обработчик для Intersection Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isFetching],
  );

  // Настройка Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  // Обработка ошибок
  if (isError) {
    return <div className={styles.error}>Error loading games: {error?.toString()}</div>;
  }

  // Обработка пустого списка
  if (!isFetching && filteredGames.length === 0 && page === 1) {
    return (
      <div className={styles.empty}>
        {searchTerm || gameTypeFilter ? 'No games match your filters' : 'No games available'}
      </div>
    );
  }

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
          <GameCard key={`${game.gameID}-${page}`} game={game} />
        ))}
      </div>

      {hasMore ? (
        <div ref={loaderRef} className={styles.loader}>
          {isFetching && <Loader />}
        </div>
      ) : (
        !isFetching && <div className={styles.endMessage}>No more games to load</div>
      )}
    </div>
  );
};

export default React.memo(GameList);
