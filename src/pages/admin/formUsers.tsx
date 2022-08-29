import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Row } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { IRootState } from '../../shared/reducers';
import { createUser, reset, updateUser, getRoles } from '../../shared/reducers/user.reducer';
import { getLocals } from '../../shared/reducers/local.reducer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { IUser } from '../../shared/model/user.model';
import { IOption } from '../../shared/model/option.model';

interface IAddUserProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IAddUserState {
  selectedLocal: IOption;
  selectedRole: IOption;
}

class FormUsers extends React.Component<IAddUserProps, IAddUserState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocal: {},
      selectedRole: {},
    };
  }

  componentDidMount() {
    this.props.getLocals(0, 1000);
    this.props.getRoles();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  componentDidUpdate(prevProps: Readonly<IAddUserProps>, prevState: Readonly<IAddUserState>) {
    const { toViewUser } = this.props;
    if (toViewUser.id && !prevState.selectedRole.key && !prevState.selectedLocal.key) {
      this.setState({
        selectedLocal: {
          value: this.props.toViewUser.local.id,
          key: this.props.toViewUser.local.id,
          label: this.props.toViewUser.local.name,
        },
        selectedRole: {
          value: this.props.toViewUser.role.id,
          key: this.props.toViewUser.role.id,
          label: this.props.toViewUser.role.name,
        },
      });
    }
  }

  handleLocalChange = (local) => {
    if (local) {
      this.setState({
        selectedLocal: local,
      });
    }
  };

  handleRoleChange = (role) => {
    if (role) {
      this.setState({
        selectedRole: role,
      });
    }
  };

  handleValidSubmit = (event, { name, password }) => {
    event.persist();
    const { toViewUser } = this.props;
    const { selectedRole, selectedLocal } = this.state;
    const MySwal = withReactContent(Swal);
    if (!selectedRole.value) {
      MySwal.fire({
        title: 'Erro!',
        text: 'O papel não pode ser vazio!',
        icon: 'error',
      });
      return;
    }
    if (!selectedLocal.value) {
      MySwal.fire({
        title: 'Erro!',
        text: 'O setor não pode ser vazio!',
        icon: 'error',
      });
      return;
    }
    if (toViewUser.id) {
      let updatedUser: IUser = {
        id: toViewUser.id,
        name,
        role_id: String(selectedRole.value),
        local_id: String(selectedLocal.value),
        active: true,
      };
      console.log(password);
      if (password && password !== '') {
        updatedUser = {
          ...updatedUser,
          password,
        };
      }
      this.props.updateUser(updatedUser);
    } else {
      const newUser: IUser = {
        name,
        password,
        role_id: String(selectedRole.value),
        local_id: String(selectedLocal.value),
        active: true,
      };
      this.props.createUser(newUser);
    }
  };

  render() {
    const {
      toViewUser,
      loading,
      createUserError,
      createUserSuccess,
      updateUserError,
      updateUserSuccess,
      locals,
      roles,
      errorMessage,
    } = this.props;

    if (!createUserSuccess && createUserError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: errorMessage ? errorMessage : 'Erro ao criar o usuário! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (!updateUserSuccess && updateUserError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: errorMessage ? errorMessage : 'Erro ao atualizar o usuário! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (!createUserError && createUserSuccess && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Usuário Cadastrado',
        text: 'Usuário cadastrado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.reset();
        this.props.history.push(`/admin/users`);
      });
    }

    if (!updateUserError && updateUserSuccess && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Usuário Atualizado',
        text: 'Usuário atualizado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.reset();
        this.props.history.push(`/admin/users`);
      });
    }

    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">{toViewUser.id ? 'Usuários' : 'Adicionar Usuário'}</CardHeader>
          <CardBody>
            <AvForm id="add-fornecedor-form" onValidSubmit={this.handleValidSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Nome</Label>
                    <AvField
                      className="form-control"
                      name="name"
                      id="name"
                      required
                      value={toViewUser.name}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="ml-3">
                    <Label for="password">{toViewUser.id ? 'Nova senha' : 'Senha'}</Label>
                    <AvField
                      className="form-control"
                      name="password"
                      id="password"
                      required={!toViewUser.id}
                      value=""
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="local">Setor</Label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      id="local"
                      name="local"
                      options={locals.map((local) => ({
                        value: local.id,
                        label: local.name,
                        key: local.id,
                      }))}
                      placeholder="Setor"
                      onChange={this.handleLocalChange}
                      value={this.state.selectedLocal}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="role">Papel</Label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      id="role"
                      name="role"
                      options={roles.map((role) => ({
                        value: role.id,
                        label: role.name,
                        key: role.id,
                      }))}
                      placeholder="Papel"
                      onChange={this.handleRoleChange}
                      value={this.state.selectedRole}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <br />
              {!toViewUser.id && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Adicionar Usuário
                </Button>
              )}
              {toViewUser.id && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Confirmar Alterações
                </Button>
              )}
              <Button tag={Link} to={`/admin/users`} className="mb-8 float-left" type="button" color="danger">
                {toViewUser.id ? 'Voltar' : 'Cancelar'}
              </Button>
            </AvForm>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  toViewUser: store.user.toViewUser,
  createUserSuccess: store.user.createUserSuccess,
  createUserError: store.user.createUserError,
  updateUserSuccess: store.user.updateUserSuccess,
  updateUserError: store.user.updateUserError,
  loading: store.user.loading,
  locals: store.local.locals,
  roles: store.user.roles,
  errorMessage: store.user.errorMessage,
});

const mapDispatchToProps = {
  createUser,
  updateUser,
  getLocals,
  reset,
  getRoles,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(FormUsers);
