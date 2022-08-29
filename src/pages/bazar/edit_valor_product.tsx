import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Row } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import Select from 'react-select';
import { getCategories } from '../../shared/reducers/category.reducer';
import { IOption } from '../../shared/model/option.model';
import { IProduct } from '../../shared/model/product.model';
import { IStock } from '../../shared/model/productLocalDonation.model';
import { createProduct, reset, updateProduct } from '../../shared/reducers/product.reducer';
import { setProductToEdit } from '../../shared/reducers/stock.reducer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface IAddTipoProdutoProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IAddTipoProdutoState {
  selectedCategory: IOption;
}

class AddTipoProduto extends React.Component<IAddTipoProdutoProps, IAddTipoProdutoState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: {},
    };
  }

  componentDidMount() {
    this.props.getCategories(0, 1000000);
  }

  componentDidUpdate(prevProps: Readonly<IAddTipoProdutoProps>, prevState: Readonly<IAddTipoProdutoState>) {
    const { toEditProduct } = this.props;
    if (!prevState.selectedCategory.value && toEditProduct.id) {
      // debugger
      this.setState({
        selectedCategory: {
          key: toEditProduct.ncm_id,
          value: toEditProduct.ncm_id,
        },
      });
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleCategoryChange = (category) => {
    if (category) {
      this.setState({
        selectedCategory: category,
      });
    }
  };

  handleValidSubmit = (event, { name, brand, valor_product }) => {
    event.persist();
    const { selectedCategory } = this.state;
    const { toEditProduct } = this.props;
    if (toEditProduct.id) {
      const updatedProduct: IStock = {
        id: toEditProduct.id,
        name,
        brand,
        valor_product: Number(valor_product),
        ncm_id: String(selectedCategory.value),
        active: true,
      };
      this.props.updateProduct(updatedProduct);
    } else {
      const newProduct: IStock = {
        name,
        brand,
        valor_product: Number(valor_product),
        ncm_id: String(selectedCategory.value),
        active: true,
      };
      this.props.createProduct(newProduct);
    }
  };

  render() {
    const {
      createProductSuccess,
      createProductError,
      loading,
      user,
      toEditProduct,
      toViewProduct,
      updateProductError,
      updateProductSuccess,
    } = this.props;

    if (!createProductSuccess && createProductError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao criar o tipo de produto! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (!updateProductSuccess && updateProductError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao atualizar o valor do produto! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (createProductSuccess && !createProductError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Valor do produto Cadastrado',
        text: 'Valor do produto cadastrado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.history.push(`${user.role.name === AUTHORITIES.BAZAR ? '/bazar/bazar' : '/bazar/bazar'}`);
      });
      this.props.reset();
    }

    if (updateProductSuccess && !updateProductError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Valor do produto Atualizado',
        text: 'Valor do produto atualizado com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.history.push(`${user.role.name === AUTHORITIES.BAZAR ? '/bazar/bazar' : '/bazar/bazar'}`);
      });
      this.props.reset();
    }

    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">Tipo produto</CardHeader>
          <CardBody>
            <AvForm id="add-category-form" onValidSubmit={this.handleValidSubmit}>
              <Row className="d-flex align-items-center">
                <Col md={12}>
                  <FormGroup className="mx-4">
                    <Label for="name">Nome</Label>
                    <AvField
                      readOnly
                      className="form-control"
                      name="name"
                      id="name"
                      required
                      value={toEditProduct.name}
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="d-flex align-items-center">
                <Col md={12}>
                  <FormGroup className='mx-4'>
                    <Label for="brand">Marca</Label>
                    <AvField
                      readOnly
                      className="form-control"
                      name="brand"
                      id="brand"
                      value={toEditProduct.brand}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="d-flex align-items-center">
                <Col md={12}>
                  <FormGroup className='mx-4'>
                    <Label for="valor_product">Valor (R$)</Label>
                    <AvField
                      className="form-control"
                      name="valor_product"
                      id="valor_product"
                      value={toEditProduct.valor_product}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <Button type="submit" className="mb-4 float-right float-down" color="success">
                {toEditProduct.id ? 'Atualizar valor do produto' : 'Atualizar valor do produto'}
              </Button>
              <Button
                tag={Link}
                to={`${user.role.name === AUTHORITIES.BAZAR ? '/bazar/bazar' : '/bazar/bazar'}`}
                type="button"
                className="mb-8 float-left"
                color="danger"
              >
                Cancelar
              </Button>
            </AvForm>
            <br />
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => ({
  categories: store.category.categories,
  createProductSuccess: store.product.createProductSuccess,
  createProductError: store.product.createProductError,
  updateProductSuccess: store.product.updateProductSuccess,
  updateProductError: store.product.updateProductError,
  loading: store.product.loading,
  toViewProduct: store.stock.toViewProduct,
  toEditProduct: store.stock.toEditProduct,

  user: store.authentication.account,
});
const mapDispatchToProps = {
  getCategories,
  createProduct,
  updateProduct,
  reset,
  setProductToEdit,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(AddTipoProduto);