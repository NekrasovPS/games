import React from 'react';
import GameList from '../../features/games/GameList/GameList';
import styles from './GamesPage.module.scss';

export const GamesPage = () => (
  <main className={styles.page}>
    <GameList />
  </main>
);
