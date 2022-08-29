import React from 'react';
import { Router } from 'react-router';
import Routes from './routes';
import history from './config/history';
import Header from './shared/components/header/header';
import Auth from './shared/components/Auth';
import { IRootState } from './shared/reducers';
import { connect } from 'react-redux';

interface IAppProps extends StateProps, DispatchProps {}

class App extends React.Component<IAppProps> {
  render() {
    return (
      <Auth>
        <Router history={history}>
          {this.props.isAuthenticated && <Header />}
          <Routes />
        </Router>
      </Auth>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  isAuthenticated: store.authentication.isAuthenticated,
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
