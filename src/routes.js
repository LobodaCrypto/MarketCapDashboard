import React from 'react';
import { Redirect, Route, Router } from 'react-router-dom';
import MarketCap from './dashboard/MarketCap/MarketCap';
import history from './history';

export const makeMainRoutes = () => {
  return (
      <Router history={history}>
        <div>
          <Route path="/" component={MarketCap}/>
        </div>
      </Router>
  );
}
