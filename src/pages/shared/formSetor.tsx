import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Row } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { IRootState } from '../../shared/reducers';
import { IContact } from '../../shared/model/contact.model';
import { ILocal } from '../../shared/model/local.model';
import { reset as resetLocal } from '../../shared/reducers/local.reducer';
import {
  createContactForLocal,
  updateContactForLocal,
  reset as resetContact,
} from '../../shared/reducers/contact.reducer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface IVerSetorProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IVerSetorState {
  readOnly: boolean;
}

class FormSetor extends React.Component<IVerSetorProps, IVerSetorState> {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
    };
  }

  componentDidMount() {
    if (this.props.user.role.name === AUTHORITIES.USER) {
      this.setState({ readOnly: true });
    }
  }

  componentWillUnmount() {
    this.props.resetLocal();
    this.props.resetContact();
  }

  handleValidSubmit = (
    event,
    { name, document, public_place, complement, number, district, city, state, country, zip_code, phone },
  ) => {
    event.persist();
    const { toViewLocal, toViewContact } = this.props;
    if (toViewLocal.id) {
      const updatedLocal: ILocal = {
        id: toViewLocal.id,
        name,
        document,
        active: true,
      };
      const updatedContact: IContact = {
        id: toViewContact.id,
        public_place,
        complement,
        number,
        district,
        city,
        state,
        country,
        zip_code,
        phone,
        active: true,
      };
      this.props.updateContactForLocal(updatedContact, updatedLocal);
    } else {
      const newLocal: ILocal = {
        name,
        document,
        active: true,
      };
      const newContact: IContact = {
        public_place,
        complement,
        number,
        district,
        city,
        state,
        country,
        zip_code,
        phone,
        active: true,
      };
      this.props.createContactForLocal(newContact, newLocal);
    }
  };

  render() {
    const { readOnly } = this.state;

    const {
      toViewLocal,
      toViewContact,
      createLocalSuccess,
      createLocalError,
      updateLocalSuccess,
      updateLocalError,
      createContactSuccess,
      createContactError,
      updateContactSuccess,
      updateContactError,
      loadingContact,
      loadingLocal,
      user,
    } = this.props;

    if (!createLocalSuccess && createLocalError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao criar o setor! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (!updateLocalSuccess && updateLocalError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao atualizar o setor! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (createContactSuccess && !createContactError && !createLocalError && createLocalSuccess) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Setor Cadastrado',
        text: 'Setor cadastrado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.resetContact();
        this.props.resetLocal();
        this.props.history.push('/admin/setor');
      });
    }

    if (
      updateContactSuccess &&
      !updateContactError &&
      !updateLocalError &&
      updateLocalSuccess &&
      !loadingContact &&
      !loadingLocal
    ) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Setor Atualizado',
        text: 'Setor atualizado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.resetContact();
        this.props.resetLocal();
        this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/setor`);
      });
    }

    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">Setor</CardHeader>
          <CardBody>
            <AvForm id="add-product-form" onValidSubmit={this.handleValidSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Nome</Label>
                    <AvField
                      className="form-control"
                      name="name"
                      id="name"
                      required
                      readOnly={readOnly}
                      value={toViewLocal.name}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="ml-3">
                    <Label for="document">Documento</Label>
                    <AvField
                      className="form-control"
                      name="document"
                      id="document"
                      required
                      readOnly={readOnly}
                      value={toViewLocal.document}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <FormGroup>
                    <Label for="public_place">Logradouro</Label>
                    <AvField
                      className="form-control"
                      name="public_place"
                      id="public_place"
                      required
                      value={toViewContact.public_place}
                      readOnly={readOnly}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <FormGroup>
                    <Label for="complement">Complemento</Label>
                    <AvField
                      className="form-control"
                      name="complement"
                      id="complement"
                      required
                      readOnly={readOnly}
                      value={toViewContact.complement}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="ml-3">
                    <Label for="number">Numero</Label>
                    <AvField
                      className="form-control"
                      name="number"
                      id="number"
                      required
                      readOnly={readOnly}
                      value={toViewContact.number}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="district">Bairro</Label>
                    <AvField
                      className="form-control"
                      name="district"
                      id="district"
                      required
                      readOnly={readOnly}
                      value={toViewContact.district}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="ml-3">
                    <Label for="city">Cidade</Label>
                    <AvField
                      className="form-control"
                      name="city"
                      id="city"
                      required
                      readOnly={readOnly}
                      value={toViewContact.city}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="ml-3">
                    <Label for="state">Estado</Label>
                    <AvField
                      className="form-control"
                      name="state"
                      id="state"
                      required
                      readOnly={readOnly}
                      value={toViewContact.state}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="country">País</Label>
                    <AvField
                      className="form-control"
                      name="country"
                      id="country"
                      required
                      readOnly={readOnly}
                      value={toViewContact.country}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="ml-3">
                    <Label for="zip_code">CEP</Label>
                    <AvField
                      className="form-control"
                      name="zip_code"
                      id="zip_code"
                      required
                      readOnly={readOnly}
                      value={toViewContact.zip_code}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="ml-3">
                    <Label for="phone">Telefone</Label>
                    <AvField
                      className="form-control"
                      name="phone"
                      id="phone"
                      required
                      readOnly={readOnly}
                      value={toViewContact.phone}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <br />
              {!toViewLocal.id && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Adicionar setor
                </Button>
              )}
              {toViewLocal.id && user.role.name === AUTHORITIES.ADMIN && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Confirmar Alterações
                </Button>
              )}
              <Button
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/setor`}
                className="mb-4 float-left"
                color="danger"
              >
                {toViewLocal.id ? 'Voltar' : 'Cancelar'}
              </Button>
            </AvForm>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  toViewLocal: store.local.toViewLocal,
  toViewContact: store.contact.toViewContact,
  createLocalSuccess: store.local.createLocalSuccess,
  createLocalError: store.local.createLocalError,
  updateLocalSuccess: store.local.updateLocalSuccess,
  updateLocalError: store.local.updateLocalError,
  createContactSuccess: store.contact.createContactSuccess,
  createContactError: store.contact.createContactError,
  updateContactSuccess: store.contact.updateContactSuccess,
  updateContactError: store.contact.updateContactError,
  loadingContact: store.contact.loading,
  loadingLocal: store.local.loading,
  user: store.authentication.account,
});

const mapDispatchToProps = {
  createContactForLocal,
  updateContactForLocal,
  resetContact,
  resetLocal,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(FormSetor);
