import React from 'react';
import { IndexRoute, Router, Route } from 'react-router';

import Followed from './views/followed';
import Channels from './views/channels';
import UI from './ui';

import { refreshChannels, refreshFollowed } from '../util/refresh';

const displayName = 'Router';

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" component={UI}>
          <IndexRoute component={Followed} onEnter={refreshFollowed}/>
          <Route path="/followed" component={Followed} onEnter={refreshFollowed}/>
          <Route path="/channels" component={Channels} onEnter={refreshChannels}/>
          <Route path="/config"/>
        </Route>
      </Router>
    );
  }
}

Routes.displayName = displayName;

export default Routes;
