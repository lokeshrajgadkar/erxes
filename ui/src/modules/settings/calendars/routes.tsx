import asyncComponent from 'modules/common/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';

const Home = asyncComponent(
  () =>
    import(
      /* webpackChunkName: "Settings - Calendar Home" */ './containers/Home'
    )
);

const Calendar = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);

  return <Home queryParams={queryParams} history={history} />;
};

const routes = () => (
  <React.Fragment>
    <Route path="/settings/calendars" component={Calendar} />
  </React.Fragment>
);

export default routes;
