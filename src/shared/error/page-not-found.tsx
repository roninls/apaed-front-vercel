import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

class PageNotFound extends React.Component {
  render() {
    return (
      <section className="infoContainerBig d-flex justify-content-center align-items-center">
        <div className="row justify-content-center">
          <div className="text-center">
            <img src="/content/assets/images/maintenance/404.png" alt="" className="img-fluid" />
            <h5 className="text-muted mb-4">
              <span>Essa página não existe</span>
            </h5>
            <Button tag={Link} to="/" className="general-button mb-4">
              Recarregar
            </Button>
          </div>
        </div>
      </section>
    );
  }
}

export default PageNotFound;
