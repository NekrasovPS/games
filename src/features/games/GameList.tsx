import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGetGamesQuery } from '../../api/gamesApi';
import { Game } from '../../types/game';

const GameList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data: currentGames = [], isFetching } = useGetGamesQuery({ page, limit });
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Обработка новых данных
  useEffect(() => {
    if (currentGames.length === 0) {
      setHasMore(false);
      return;
    }

    setAllGames((prev) => {
      // Фильтрация дубликатов
      const newGames = currentGames.filter((game) => !prev.some((g) => g.gameID === game.gameID));
      return [...prev, ...newGames];
    });

    // Если пришло меньше игр чем лимит - значит это последняя страница
    if (currentGames.length < limit) {
      setHasMore(false);
    }
  }, [currentGames, limit]);

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

  return (
    <div className="games-grid">
      {allGames.map((game) => (
        <div key={game.gameID} className="game-card">
          <img
            src={`https://bsw-dk1.pragmaticplay.net/game_pic/square/200/${game.gameID}.png`}
            alt={game.gameName}
            loading="lazy"
          />
          <h3>{game.gameName}</h3>
        </div>
      ))}

      {hasMore ? (
        <div ref={loaderRef} style={{ height: '20px', margin: '10px 0' }}>
          {isFetching && 'Loading...'}
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>No more games to load</div>
      )}
    </div>
  );
};

export default GameList;
