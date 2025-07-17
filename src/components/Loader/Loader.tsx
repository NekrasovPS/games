import React from 'react';
import styles from './Loader.module.scss';

export const Loader = () => (
  <div className={styles.container} aria-live="polite">
    <div className={styles.spinner}></div>
    <span>Loading...</span>
  </div>
);
