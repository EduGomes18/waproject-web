import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import DemandForm from './Form';
import DemandListPage from './List';

const DemandIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/' component={DemandListPage} />
      <Route path='/:id' component={DemandForm} />
    </Switch>
  );
});

export default DemandIndexPage;
