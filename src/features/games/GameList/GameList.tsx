import React from 'react';
import { GameCard } from '../../../components/GameCard/GameCard';
import { GameFilters } from '../../../components/GameFilters/GameFilters';
import { Loader } from '../../../components/Loader/Loader';
import styles from './GameList.module.scss';
import { useGames } from '../../../hooks/useGames';

const GameList: React.FC = () => {
  const {
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
  } = useGames();

  if (isFetching && filteredGames.length === 0) {
    return (
      <div className={styles.container}>
        <Loader />
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
      <h1>Pragmatic play</h1>

      {isError && <div className={styles.error}>Ошибка загрузки игр: {String(error)}</div>}

      {!isFetching && filteredGames.length === 0 && (
        <div className={styles.empty}>
          {searchTerm || gameTypeFilter ? 'Нет совпадений по фильтрам' : 'Игры отсутствуют'}
        </div>
      )}

      <div className={styles.grid}>
        {filteredGames.map((game) => (
          <GameCard key={game.gameID} game={game} />
        ))}
      </div>

      {hasMore && !searchTerm && !gameTypeFilter && (
        <div ref={observerRef} className={styles.loader}>
          {isFetching && <Loader />}
        </div>
      )}
    </div>
  );
};

export default GameList;
