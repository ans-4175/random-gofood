import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import queryClient from './api/queryClient';
import useGoogleAnalytics from './libs/use-analytics';

import Home from './Home';
import About from './About';

import './App.css';

const App = () => {
  useGoogleAnalytics();

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
      </Switch>
    </QueryClientProvider>
  );
};

export default App;
