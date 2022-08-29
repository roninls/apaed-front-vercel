import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { IRootState } from '../../shared/reducers';
import { createFoodStamp, updateFoodStamp, reset as resetFoodStamp } from '../../shared/reducers/food-stamp.reducer';
import { IFoodStamp } from '../../shared/model/foodStamp.model';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface IAddFoodStampProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IAddFoodStampState {
  readOnly: boolean;
  products: any[];
}

class FormCestaBasica extends React.Component<IAddFoodStampProps, IAddFoodStampState> {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
      products: [],
    };
  }

  componentDidMount() {
    if (this.props.user.role.name === AUTHORITIES.USER) {
      this.setState({ readOnly: true });
    }
  }

  componentWillUnmount() {
    this.props.resetFoodStamp();
  }

  handleValidSubmit = (event, { name, type, open, delivered }) => {
    event.persist();
    const { toViewFoodStamp } = this.props;
    if (toViewFoodStamp.id) {
      const updatedFoodStamp: IFoodStamp = {
        id: toViewFoodStamp.id,
        name,
        type,
        open,
        active: true,
        delivered,
      };
      this.props.updateFoodStamp(updatedFoodStamp);
    } else {
      const newFoodStamp: IFoodStamp = {
        name,
        type,
        open: true,
        active: true,
        delivered: false,
      };
      this.props.createFoodStamp(newFoodStamp);
    }
  };

  render() {
    const {
      createFoodStampSuccess,
      createFoodStampError,
      updateFoodStampSuccess,
      updateFoodStampError,
      loadingFoodStamp,
      toViewFoodStamp,
      user,
    } = this.props;

    const { readOnly } = this.state;

    if (!createFoodStampSuccess && createFoodStampError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao criar a cesta básica! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (!createFoodStampSuccess && createFoodStampError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao atualizar a cesta básica! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (createFoodStampSuccess && !createFoodStampError && !loadingFoodStamp) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Cesta básica cadastrada',
        text: 'Cesta básica cadastrado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.resetFoodStamp();
        this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/cestaBasica`);
      });
    }

    if (updateFoodStampSuccess && !updateFoodStampError && !loadingFoodStamp) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Cesta básica atualizada',
        text: 'Cesta básica atualizada com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.resetFoodStamp();
        this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/cestaBasica`);
      });
    }

    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">
            {toViewFoodStamp.id ? 'Cesta básica' : 'Adicionar Cesta básica'}
          </CardHeader>
          <CardBody>
            <AvForm id="add-cesta-basica-form" onValidSubmit={this.handleValidSubmit}>
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
                      value={toViewFoodStamp.name}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="ml-3">
                    <Label for="type">Tipo</Label>
                    <AvField
                      className="form-control"
                      name="type"
                      id="type"
                      required
                      readOnly={readOnly}
                      value={toViewFoodStamp.type}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              {toViewFoodStamp.id && (
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="open">Aberta</Label>
                      <AvRadioGroup
                        inline
                        name="open"
                        id="open"
                        required
                        value={toViewFoodStamp.open}
                        errorMessage="Esse campo é obrigatório!"
                      >
                        <AvRadio customInput label="Sim" name="open" value={true} readOnly={readOnly} />
                        <AvRadio customInput label="Não" name="open" value={false} readOnly={readOnly} />
                      </AvRadioGroup>
                    </FormGroup>
                  </Col>
                </Row>
              )}
              {toViewFoodStamp.id && (
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="delivered">Entregue</Label>
                      <AvRadioGroup
                        inline
                        name="delivered"
                        id="delivered"
                        required
                        value={toViewFoodStamp.delivered}
                        errorMessage="Esse campo é obrigatório!"
                      >
                        <AvRadio customInput label="Sim" name="delivered" value={true} readOnly={readOnly} />
                        <AvRadio customInput label="Não" name="delivered" value={false} readOnly={readOnly} />
                      </AvRadioGroup>
                    </FormGroup>
                  </Col>
                </Row>
              )}
              {!toViewFoodStamp.id && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Adicionar cesta básica
                </Button>
              )}
              {toViewFoodStamp.id && user.role.name === AUTHORITIES.ADMIN && (
                <Button className="mb-4 float-right float-down" color="success" type="submit">
                  Confirmar Alterações
                </Button>
              )}
              <Button
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/cestaBasica`}
                className="mb-8 float-left"
                type="button"
                color="danger"
              >
                {toViewFoodStamp.id ? 'Voltar' : 'Cancelar'}
              </Button>
            </AvForm>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  foodStamp: store.foodStamp.foodStamps,
  createFoodStampSuccess: store.foodStamp.createFoodStampSuccess,
  createFoodStampError: store.foodStamp.createFoodStampError,
  updateFoodStampSuccess: store.foodStamp.updateFoodStampSuccess,
  updateFoodStampError: store.foodStamp.updateFoodStampError,
  loadingFoodStamp: store.foodStamp.loading,
  toViewFoodStamp: store.foodStamp.toViewFoodStamps,
  user: store.authentication.account,
  products: store.foodStamp.products,
});

const mapDispatchToProps = {
  createFoodStamp,
  updateFoodStamp,
  resetFoodStamp,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(FormCestaBasica);
