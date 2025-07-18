import React from 'react';
import styles from '../GameCard/GameCard.module.scss';

interface GameCardProps {
  game: {
    gameID: string;
    gameName: string;
    gameTypeID: string;
  };
}

export const GameCard = React.memo(({ game }: GameCardProps) => (
  <article className={styles.card}>
    <img
      src={`https://bsw-dk1.pragmaticplay.net/game_pic/square/200/${game.gameID}.png`}
      alt={game.gameName}
      loading="lazy"
      className={styles.image}
      width={200}
      height={200}
    />
    <div className={styles.content}>
      <h3 className={styles.title}>{game.gameName}</h3>
    </div>
  </article>
));

GameCard.displayName = 'GameCard';
