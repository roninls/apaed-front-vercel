import React from 'react';

import '../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { Redirect } from 'react-router-dom';
import { login, reset } from '../shared/reducers/authentication';
import { IRootState } from '../shared/reducers';
import { AUTHORITIES } from '../config/constants';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

interface ILoginProps extends StateProps, DispatchProps {}

class Login extends React.Component<ILoginProps> {
  handleSubmit = (event, errors, { username, password }) => {
    event.persist();
    if (errors.length === 0) this.props.login(username, password);
  };

  render() {
    const { loginError, loginSuccess, loading } = this.props;

    if (!loginSuccess && loginError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Nome de usuário ou senha incorretos!',
        icon: 'error',
      }).then(() => this.props.reset());
    }

    return (
      <>
        {this.props.isAuthenticated ? (
          this.props.user.role.name === AUTHORITIES.USER ? (
            <Redirect to="/user/estoque" />
          ) : (
            <Redirect to="/admin/estoque" />
          )
        ) : (
          ''
        )}

        {this.props.isAuthenticated ? (
          this.props.user.role.name === AUTHORITIES.BAZAR ? (
            <Redirect to="/bazar/bazar" />
          ) : (
            <></>
          )
        ) : (
          ''
        )}

        <div className="d-flex h-100 align-items-center justify-content-center">
          <Card className="w-25 shadow-lg">
            <CardHeader className="bg-dark text-white">Login</CardHeader>
            <CardBody>
              <AvForm onSubmit={this.handleSubmit}>
                <Row>
                  <Col md="12">
                    <AvField
                      name="username"
                      label="Nome de Usuario"
                      placeholder="Nome de Usuario"
                      autoFocus
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'O nome de usuário é obrigatório!',
                        },
                        minLength: {
                          value: 4,
                          errorMessage: 'O nome de usuário deve ter no minimo 4 letras',
                        },
                        maxLength: {
                          value: 20,
                          errorMessage: 'O nome de usuário deve ter no maximo 20 letras',
                        },
                      }}
                    />
                    <AvField
                      name="password"
                      type="password"
                      label="Senha"
                      placeholder="Senha"
                      required
                      errorMessage="A senha é obrigatória!"
                    />
                  </Col>
                </Row>
                <div className="mt-1">&nbsp;</div>
                <Button color="success" type="submit">
                  Logar
                </Button>
              </AvForm>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  isAuthenticated: store.authentication.isAuthenticated,
  user: store.authentication.account,
  loginSuccess: store.authentication.loginSuccess,
  loginError: store.authentication.loginError,
  loading: store.authentication.loading,
});
const mapDispatchToProps = {
  login,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Login);
