import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Link, RouteComponentProps } from 'react-router-dom';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { makeTransfer, reset } from '../../shared/reducers/food-stamp.reducer';
import { ITransferFoodStamp } from '../../shared/model/transfer.model';
import { getFoodStamps } from 'shared/reducers/food-stamp.reducer';
import { IOption } from '../../shared/model/option.model';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface ITransferirCestaProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransferirCestaState {
  description: string;
  foodStamp: IOption;
}

class TransferirCesta extends React.Component<ITransferirCestaProps, ITransferirCestaState> {
  constructor(props) {
    super(props);
    this.state = {
      description: 'Baixa Realizada!',
      foodStamp: {
        key: '',
        label: 'Vendas',
        value: 'ef5fe88c-e38f-470e-afff-cb0686aa227a',
      },
    };
  }

  componentDidMount() {
    this.props.getFoodStamps(0, 1000000);
  }

  setSelectedFoodStamp = (foodStamp) => {
    if (foodStamp) {
      this.setState({
        foodStamp,
      });
    }
  };

  handleValidSubmit = (event, { total_amount_transfered }) => {
    event.persist();
    if (this.state.description.length === 0) {
      return;
    }
    const newTransfer: ITransferFoodStamp = {
      description: this.state.description,
      product_id: this.props.toTransferProduct.product_id,
      total_amount_transfered: Number(total_amount_transfered),
      food_stamp_id: String(this.state.foodStamp.value),
      expiration_date: this.props.toTransferProduct.expiration_date,
      active: true,
    };
    this.props.makeTransfer(newTransfer);
  };

  render() {
    const { toTransferProduct, user, makeTransferSuccess, makeTransferError, foodStamps } = this.props;
    const foodStampsOpen = foodStamps.filter((foodStamp) => foodStamp.open);

    if (!makeTransferSuccess && makeTransferError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Baixa não pode ser realizada! Por favor, tente novamente!',
        icon: 'error',
      }).then(() => this.props.history.push(`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/bazar`));
      this.props.reset();
    }

    if (!makeTransferError && makeTransferSuccess) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Baixa Realizada!',
        text: 'A sua baixa foi realizada com sucesso!',
        icon: 'success',
      }).then(() => this.props.history.push(`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/bazar`));
      this.props.reset();
    }
    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">Baixa de produto</CardHeader>
          <CardBody>
            <AvForm id="add-product-form" onValidSubmit={this.handleValidSubmit}>
              <Row>
                <Col md={12}>
                  <FormGroup row>
                    <Label for="exampleEmail">Codigo NCM</Label>
                    <Input readOnly name="ncm_code" value={toTransferProduct.product?.ncm?.ncm_code} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup row>
                    <Label for="exampleEmail">Nome</Label>
                    <Input readOnly name="name" value={toTransferProduct.product?.name} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup className="mr-4">
                    <Label for="amount">
                      Quantidade (Max: {this.props.amount}){' '}
                      {toTransferProduct.product?.ncm?.unity_measurement?.unity_measurement}
                    </Label>
                    <AvField
                      className="form-control"
                      name="total_amount_transfered"
                      id="total_amount_transfered"
                      type="number"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Esse campo é obrigatório!',
                        },
                        max: {
                          value: this.props.amount,
                          errorMessage: `O limite de transferência é ${this.props.amount}`,
                        },
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
              <Col md={12}>
                  <FormGroup>
                    <Label for="description">Motivo da tranferência</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      value={this.state.description}
                      onChange={(event) => this.setState({ description: event.target.value })}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <Button className="mb-4 float-right float-down" color="success" type="submit">
                Baixa em produto
              </Button>
              <Button
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/bazar`}
                className="mb-8 float-left"
                type="button"
                color="danger"
              >
                Cancelar
              </Button>
            </AvForm>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  user: store.authentication.account,
  foodStamps: store.foodStamp.foodStamps,
  makeTransferSuccess: store.foodStamp.makeTransferSuccess,
  makeTransferError: store.foodStamp.makeTransferError,
  amount: store.foodStamp.amount,
  toTransferProduct: store.foodStamp.toTransferProduct,
});

const mapDispatchToProps = {
  makeTransfer,
  getFoodStamps,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(TransferirCesta);
