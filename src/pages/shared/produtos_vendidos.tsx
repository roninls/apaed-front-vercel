import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Link, RouteComponentProps } from 'react-router-dom';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { makeTransfer, resetSuccessTransfer } from '../../shared/reducers/transfer.reducer';
import { ITransferPostPut } from '../../shared/model/transfer.model';
import { getLocals } from '../../shared/reducers/local.reducer';
import { IOption } from '../../shared/model/option.model';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface ITransferirProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransferirState {
  description: string;
  destiny: IOption;
}

class Transferir extends React.Component<ITransferirProps, ITransferirState> {
  constructor(props) {
    super(props);
    this.state = {
      description: 'Baixa Realizada!',
      destiny: {
        key: '',
        label: 'Baixas',
        value: 'd76f768f-bf7d-424f-8f11-f5eff9bbef23',
      },
    };
  }

  componentDidMount() {
    this.props.getLocals(0, 1000000);
  }

  setSelectedDestiny = (destiny) => {
    if (destiny) {
      this.setState({
        destiny,
      });
    }
  };

  handleValidSubmit = (event, { total_amount_transfered }) => {
    event.persist();
    if (this.state.description.length === 0) {
      return;
    }
    const newTransfer: ITransferPostPut = {
      description: this.state.description,
      product_id: this.props.toTransferProduct.product_id,
      total_amount_transfered: Number(total_amount_transfered),
      destiny_id: String(this.state.destiny.value),
      expiration_date: this.props.toTransferProduct.expiration_date,
      active: true,
      product_name: this.props.toTransferProduct.product.name,
      product_brand: this.props.toTransferProduct.product.brand,
      product_ncm_code: this.props.toTransferProduct.product.ncm.ncm_code,
    };
    this.props.makeTransfer(newTransfer);
  };

  render() {
    const { toTransferProduct, locals, user, makeTransferSuccess, makeTransferError } = this.props;
    const localsWithoutSelf = locals.filter((local) => local.id !== user.local_id);

    if (!makeTransferSuccess && makeTransferError) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Baixa n??o pode ser realizada! Por favor, tente novamente!',
        icon: 'error',
      }).then(() => this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'bazar'}/estoque`));
      this.props.resetSuccessTransfer();
    }

    if (!makeTransferError && makeTransferSuccess) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Baixa Realizada!',
        text: 'A sua baixa foi realizada com sucesso!',
        icon: 'success',
      }).then(() => this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'bazar'}/estoque`));
      this.props.resetSuccessTransfer();
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
                <Col md={12}>
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
                          errorMessage: 'Esse campo ?? obrigat??rio!',
                        },
                        max: {
                          value: this.props.amount,
                          errorMessage: `O limite de transfer??ncia ?? ${this.props.amount}`,
                        },
                      }}
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
                to={`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'bazar' }/estoque`}
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
  toTransferProduct: store.transfer.toTransferProduct,
  locals: store.local.locals,
  user: store.authentication.account,
  makeTransferSuccess: store.transfer.makeTransferSuccess,
  makeTransferError: store.transfer.makeTransferError,
  amount: store.transfer.amount,
});

const mapDispatchToProps = {
  makeTransfer,
  getLocals,
  resetSuccessTransfer,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Transferir);