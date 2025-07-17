import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { GamesPage } from './pages/GamesPage/GamesPage';
import './assets/styles/global.scss';

export const App = () => (
  <Provider store={store}>
    <GamesPage />
  </Provider>
);
