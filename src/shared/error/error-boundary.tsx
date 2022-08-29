import './error.scss';

import React from 'react';
import { Alert, Button } from 'reactstrap';
import Prism from '../../shared/components/Prism';

interface IErrorBoundaryProps {
  readonly children: JSX.Element | JSX.Element[];
}

interface IErrorBoundaryState {
  readonly error: any;
  readonly errorInfo: any;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    if (errorInfo) {
      const errorDetails =
        process.env.NODE_ENV === 'development' ? (
          <>
            <details className="text-justify">
              <Alert color="danger">
                <h4 className="alert-heading">{error && error.toString()}</h4>
                <p>Error Info Stack</p>
                <hr />
                <Prism code={errorInfo.componentStack} language="log" />
              </Alert>
            </details>
            <br />
          </>
        ) : undefined;
      return (
        <div className="container">
          <div className="row justify-content-center">
            <div className="text-center">
              <img src="/content/images/manutencao.jpg" alt="" className="img-fluid" />
              <h5 className="text-muted mb-4">
                <span>Site Sob Manutenção</span>
              </h5>
              {errorDetails}
              <Button onClick={() => window.location.reload()} color="primary" className="mb-4">
                <i className="feather icon-refresh-ccw mr-2" />
                <span>Recarregar</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
