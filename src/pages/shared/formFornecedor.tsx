import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Row } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { IRootState } from '../../shared/reducers';
import { reset as resetDonor } from '../../shared/reducers/donor.reducer';
import { IDonor } from '../../shared/model/donor.model';
import { IContact } from '../../shared/model/contact.model';
import {
  createContactForFornecedor,
  reset as resetContact,
  updateContactForFornecedor,
} from '../../shared/reducers/contact.reducer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface IAddFornecedorProps extends StateProps, DispatchProps, RouteComponentProps {}

class FormFornecedor extends React.Component<IAddFornecedorProps> {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
    };
  }

  componentWillUnmount() {
    this.props.resetDonor();
    this.props.resetContact();
  }

  handleValidSubmit = (
    event,
    { name, email, document, public_place, complement, number, district, city, state, country, zip_code, phone },
  ) => {
    event.persist();
    const { toViewDonor, toViewContact } = this.props;
    if (toViewDonor.id) {
      const updatedDonor: IDonor = {
        id: toViewDonor.id,
        name,
        email,
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
      this.props.updateContactForFornecedor(updatedContact, updatedDonor);
    } else {
      const newDonor: IDonor = {
        name,
        email,
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
      this.props.createContactForFornecedor(newContact, newDonor);
    }
  };

  render() {
    const {
      createContactSuccess,
      createContactError,
      updateContactSuccess,
      updateContactError,
      createDonorSuccess,
      createDonorError,
      updateDonorSuccess,
      updateDonorError,
      loadingContact,
      loadingDonor,
      toViewDonor,
      toViewContact,
      user,
    } = this.props;

    if (!createDonorSuccess && createDonorError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao criar o fornecedor/doador! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (!updateDonorSuccess && updateDonorError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao atualizar o fornecedor/doador! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (
      createContactSuccess &&
      !createContactError &&
      !createDonorError &&
      createDonorSuccess &&
      !loadingContact &&
      !loadingDonor
    ) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Fornecedor/Doador Cadastrado',
        text: 'Fornecedor/Doador cadastrado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.resetContact();
        this.props.resetDonor();
        this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/fornecedor`);
      });
    }

    if (
      updateContactSuccess &&
      !updateContactError &&
      !updateDonorError &&
      updateDonorSuccess &&
      !loadingContact &&
      !loadingDonor
    ) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Fornecedor/Doador Atualizado',
        text: 'Fornecedor/Doador atualizado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.resetContact();
        this.props.resetDonor();
        this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/fornecedor`);
      });
    }

    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">
            {toViewDonor.id ? 'Fornecedor/Doador' : 'Adicionar Fornecedor/Doador'}
          </CardHeader>
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
                      value={toViewDonor.name}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="ml-3">
                    <Label for="email">Email</Label>
                    <AvField
                      className="form-control"
                      name="email"
                      id="email"
                      required
                      value={toViewDonor.email}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="document">Documento</Label>
                    <AvField
                      className="form-control"
                      name="document"
                      id="document"
                      required
                      value={toViewDonor.document}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={8}>
                  <FormGroup className="ml-3">
                    <Label for="public_place">Logradouro</Label>
                    <AvField
                      className="form-control"
                      name="public_place"
                      id="public_place"
                      required
                      value={toViewContact.public_place}
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
                      value={toViewContact.phone}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <br />
              {!toViewDonor.id && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Adicionar fornecedor/doador
                </Button>
              )}
              {toViewDonor.id && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Confirmar Alterações
                </Button>
              )}
              <Button
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/fornecedor`}
                className="mb-8 float-left"
                type="button"
                color="danger"
              >
                {toViewDonor.id ? 'Voltar' : 'Cancelar'}
              </Button>
            </AvForm>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  contact: store.contact.contact,
  createDonorSuccess: store.donor.createDonorSuccess,
  createDonorError: store.donor.createDonorError,
  updateDonorSuccess: store.donor.updateDonorSuccess,
  updateDonorError: store.donor.updateDonorError,
  createContactSuccess: store.contact.createContactSuccess,
  createContactError: store.contact.createContactError,
  updateContactSuccess: store.contact.updateContactSuccess,
  updateContactError: store.contact.updateContactError,
  loadingContact: store.contact.loading,
  loadingDonor: store.donor.loading,
  toViewDonor: store.donor.toViewDonor,
  toViewContact: store.contact.toViewContact,
  user: store.authentication.account,
});

const mapDispatchToProps = {
  createContactForFornecedor,
  updateContactForFornecedor,
  resetContact,
  resetDonor,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(FormFornecedor);
