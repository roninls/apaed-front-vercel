import React from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import Select from 'react-select';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Row } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { getTypes } from '../../shared/reducers/type.reducer';
import { IOption } from '../../shared/model/option.model';
import { getUnitsMeasure } from '../../shared/reducers/unityMeasurement.reducer';
import { ICategory } from '../../shared/model/category.model';
import { createCategory, reset, updateCategory } from '../../shared/reducers/category.reducer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AUTHORITIES } from '../../config/constants';

interface ICategoriaProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ICategoriaState {
  selectedType: IOption;
  selectedUnityMeasurement: IOption;
}

class Categoria extends React.Component<ICategoriaProps, ICategoriaState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: {},
      selectedUnityMeasurement: {},
    };
  }

  componentDidMount() {
    this.props.getTypes();
    this.props.getUnitsMeasure();
  }

  componentDidUpdate(prevProps: Readonly<ICategoriaProps>, prevState: Readonly<ICategoriaState>) {
    const { toViewCategory } = this.props;
    if (toViewCategory.id && !prevState.selectedType.value) {
      this.setState({
        selectedType: {
          value: toViewCategory.type.id,
          key: toViewCategory.type.id,
          label: toViewCategory.type.type,
        },
        selectedUnityMeasurement: {
          value: toViewCategory.unity_measurement.id,
          key: toViewCategory.unity_measurement.id,
          label: toViewCategory.unity_measurement.unity_measurement,
        },
      });
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleTypeChange = (type) => {
    if (type) {
      this.setState({
        selectedType: type,
      });
    }
  };

  handleUnityMeasurementChange = (unity_measurement) => {
    if (unity_measurement) {
      this.setState({
        selectedUnityMeasurement: unity_measurement,
      });
    }
  };

  handleValidSubmit = (event, { ncm_code, name, minimal_qntt, long_description, minimal_more_products }) => {
    event.persist();
    const { selectedUnityMeasurement, selectedType } = this.state;
    const { toViewCategory } = this.props;
    if (toViewCategory.id) {
      const updatedCategory: ICategory = {
        id: toViewCategory.id,
        ncm_code,
        description: name,
        minimal_qntt,
        long_description,
        unity_measurement_id: String(selectedUnityMeasurement.value),
        minimal_more_products,
        type_id: String(selectedType.value),
        active: true,
      };
      this.props.updateCategory(updatedCategory);
    } else {
      const newCategory: ICategory = {
        ncm_code,
        minimal_qntt,
        long_description,
        description: name,
        unity_measurement_id: String(selectedUnityMeasurement.value),
        minimal_more_products,
        type_id: String(selectedType.value),
        active: true,
      };
      this.props.createCategory(newCategory);
    }
  };

  render() {
    const {
      types,
      unitsMeasure,
      createCategoryError,
      createCategorySuccess,
      updateCategoryError,
      updateCategorySuccess,
      loading,
      toViewCategory,
      user,
    } = this.props;

    if (createCategorySuccess && !createCategoryError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Categoria Cadastrada',
        text: 'Categoria Cadastrada com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.reset();
        this.props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin/categories' : 'user/addProduto'}`);
      });
    }

    if (!createCategorySuccess && createCategoryError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao criar categoria! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    if (updateCategorySuccess && !updateCategoryError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Categoria Atualizada!',
        text: 'Categoria Atualizada com sucesso!',
        icon: 'success',
      }).then(() => {
        this.props.reset();
        this.props.history.push('/admin/categories');
      });
    }

    if (!updateCategorySuccess && updateCategoryError && !loading) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Erro!',
        text: 'Erro ao atualizar categoria! Por favor, tente novamente!',
        icon: 'error',
      });
    }

    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <Card className="w-50 shadow-lg">
          <CardHeader className="bg-dark text-white">Categoria</CardHeader>
          <CardBody>
            <AvForm id="add-category-form" onValidSubmit={this.handleValidSubmit}>
              <Row className="d-flex align-items-center">
                <Col md={6}>
                  <FormGroup>
                    <Label for="type">Tipo</Label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      id="type"
                      name="type"
                      options={types.map((type) => ({
                        value: type.id,
                        label: type.type,
                        key: type.id,
                      }))}
                      placeholder="type"
                      onChange={this.handleTypeChange}
                      value={this.state.selectedType}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mx-4">
                    <Label for="ncm_code">Codigo NCM</Label>
                    <AvField
                      className="form-control"
                      name="ncm_code"
                      id="ncm_code"
                      value={toViewCategory.ncm_code}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="d-flex align-items-center">
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Nome</Label>
                    <AvField
                      className="form-control"
                      name="name"
                      id="name"
                      value={toViewCategory.description}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mx-4">
                    <Label for="minimal_qntt">Quantidade Minima</Label>
                    <AvField
                      className="form-control"
                      name="minimal_qntt"
                      id="minimal_qntt"
                      type="number"
                      value={toViewCategory.minimal_qntt}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Esse campo é obrigatório!',
                        },
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup className="mr-4">
                    <Label for="long_description">Descrição</Label>
                    <AvField
                      className="form-control"
                      name="long_description"
                      id="long_description"
                      value={toViewCategory.long_description}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <FormGroup className="mr-4">
                    <Label for="long_description">Quantidade Sobressalente</Label>
                    <AvField
                      className="form-control"
                      name="minimal_more_products"
                      id="minimal_more_products"
                      value={toViewCategory.minimal_more_products}
                      required
                      errorMessage="Esse campo é obrigatório!"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="unity_measurement">Unidade de Medida</Label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      id="unity_measurement"
                      name="unity_measurement"
                      options={unitsMeasure.map((unity_measurement) => ({
                        value: unity_measurement.id,
                        label: unity_measurement.unity_measurement,
                        key: unity_measurement.id,
                      }))}
                      placeholder="Unidade de Medida"
                      onChange={this.handleUnityMeasurementChange}
                      value={this.state.selectedUnityMeasurement}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <Button type="submit" className="mb-4 float-right float-down" color="success">
                {toViewCategory.id ? 'Atualizar Categoria' : 'Adicionar Categoria'}
              </Button>
              <Button
                tag={Link}
                to={`${user.role.name === AUTHORITIES.ADMIN ? '/admin/categories' : '/user/addProduto'}`}
                type="button"
                className="mb-8 float-left"
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
  types: store.type.types,
  unitsMeasure: store.unityMeasurement.unitsMeasure,
  loading: store.category.loading,
  createCategorySuccess: store.category.createCategorySuccess,
  createCategoryError: store.category.createCategoryError,
  updateCategorySuccess: store.category.updateCategorySuccess,
  updateCategoryError: store.category.updateCategoryError,
  user: store.authentication.account,
  toViewCategory: store.category.toViewCategory,
});
const mapDispatchToProps = {
  getTypes,
  getUnitsMeasure,
  createCategory,
  updateCategory,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Categoria);
