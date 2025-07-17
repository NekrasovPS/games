import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useGetGamesQuery } from '../../api/gamesApi';
import { Game } from '../../types/game';
import GameFilters from '../../components/GameFilters/GameFilters';

const GameList: React.FC = () => {
  // Состояния пагинации
  const [page, setPage] = useState(1);
  const limit = 20;

  // Состояния фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('');

  // Запрос данных
  const {
    data: currentGames = [],
    isFetching,
    isError,
  } = useGetGamesQuery({
    page,
    limit,
  });

  // Локальное хранилище всех игр
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Получаем уникальные типы игр для фильтра
  const gameTypes = useMemo(() => {
    const types = new Set<string>();
    allGames.forEach((game) => types.add(game.gameTypeID));
    return Array.from(types).sort();
  }, [allGames]);

  // Фильтрация игр
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const matchesSearch = game.gameName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = gameTypeFilter ? game.gameTypeID === gameTypeFilter : true;

      return matchesSearch && matchesType;
    });
  }, [allGames, searchTerm, gameTypeFilter]);

  // Обработка новых данных
  useEffect(() => {
    if (isError) {
      setHasMore(false);
      return;
    }

    if (currentGames.length === 0) {
      setHasMore(false);
      return;
    }

    setAllGames((prev) => [
      ...prev,
      ...currentGames.filter((game) => !prev.some((g) => g.gameID === game.gameID)),
    ]);

    setHasMore(currentGames.length >= limit);
  }, [currentGames, limit, isError]);

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

  // Настройка Observer
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

  if (isError) {
    return <div className="error-message">Failed to load games. Please try again later.</div>;
  }

  return (
    <div className="games-container">
      {/* Компонент фильтров */}
      <GameFilters
        searchTerm={searchTerm}
        gameTypeFilter={gameTypeFilter}
        gameTypes={gameTypes}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setGameTypeFilter}
      />

      {/* Список игр */}
      <div className="games-grid">
        {filteredGames.map((game) => (
          <div key={game.gameID} className="game-card">
            <img
              src={`https://bsw-dk1.pragmaticplay.net/game_pic/square/200/${game.gameID}.png`}
              alt={game.gameName}
              loading="lazy"
              width={200}
              height={200}
            />
            <h3>{game.gameName}</h3>
            <p className="game-type">{game.gameTypeID}</p>
          </div>
        ))}

        {/* Индикатор загрузки */}
        {hasMore ? (
          <div ref={loaderRef} className="loader" aria-busy={isFetching}>
            {isFetching && 'Loading more games...'}
          </div>
        ) : (
          <div className="end-message">No more games available</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(GameList);
