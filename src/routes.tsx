import React from 'react';
import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from './shared/error/error-boundary-route';
import PageNotFound from './shared/error/page-not-found';
import Login from './pages/login';
import PrivateRoute from './shared/auth/private-route';
import Estoquista from './pages/estoquista';
import Admin from './pages/admin';
import Bazars from './pages/bazar';
import { AUTHORITIES } from './config/constants';

function Routes() {
  return (
    <Switch>
      <ErrorBoundaryRoute exact path="/" component={Login} />
      <PrivateRoute path="/user" component={Estoquista} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute path="/bazar" component={Bazars} hasAnyAuthorities={[AUTHORITIES.BAZAR]} />
      <ErrorBoundaryRoute path="/" component={PageNotFound} />
    </Switch>
  );
}

export default Routes;
