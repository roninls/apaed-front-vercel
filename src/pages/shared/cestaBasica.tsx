import React, { useEffect, useState } from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { deleteFoodStamp, getFoodStamps, setToViewFoodStamp, reset } from '../../shared/reducers/food-stamp.reducer';
import { getStockByFoodStampId, updateProduct } from 'shared/reducers/stock.reducer';
import { AUTHORITIES } from '../../config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faListOl, faTrash } from '@fortawesome/free-solid-svg-icons';
import Table from '../../shared/components/Table';
import { getContactById } from '../../shared/reducers/contact.reducer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface IFoodStampsProps extends StateProps, DispatchProps, RouteComponentProps {}

function CestaBasica(props: IFoodStampsProps): JSX.Element {
  const {
    foodStamps,
    user,
    loading,
    totalCount,
    deleteFoodStampError,
    deleteFoodStampSuccess,
    stockByFoodStampId,
  } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [foodStampId, setFoodStampId] = useState('');

  useEffect(() => {
    props.getFoodStamps(0, 10);
    // eslint-disable-next-line
  }, []);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getFoodStamps(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      Header: 'Cestas básicas',
      columns: [
        {
          Header: 'Nome',
          accessor: 'name',
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: foodStamp } }) => (
            <>
              <Button
                onClick={() => {
                  props.setToViewFoodStamp(foodStamp);
                  // props.getContactById(foodStamp.id);
                  props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/viewCestaBasica`);
                }}
                color="info"
              >
                <FontAwesomeIcon icon={faInfo} />
              </Button>
              <Button
                onClick={() => {
                  //Open modal
                  setModalOpen(true);
                  console.log(foodStamp.id);
                  setFoodStampId(foodStamp.id);
                  props.getStockByFoodStampId(foodStamp.id, 0, 10);
                }}
              >
                <FontAwesomeIcon icon={faListOl} />
              </Button>
              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Deseja deletar a Cesta básica?',
                    confirmButtonText: 'Deletar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      props.deleteFoodStamp(foodStamp.id);
                      if (deleteFoodStampSuccess && !deleteFoodStampError && !loading) {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                          title: 'Cesta básica deletada!',
                          text: 'Cesta básica deletada com sucesso!',
                          icon: 'success',
                        }).then(() => {
                          props.reset();
                          props.history.push('/admin/cestaBasica');
                        });
                      }
                    } else if (!deleteFoodStampSuccess && deleteFoodStampError && !loading) {
                      const MySwal = withReactContent(Swal);
                      MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao deletar Cesta básica! Por favor, tente novamente!',
                        icon: 'error',
                      });
                    }
                  });
                }}
                color="trash"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </>
          ),
        },
      ],
    },
  ];

  return (
    <div className="d-flex h-100 align-items-center justify-content-center">
      <Modal
        isOpen={isModalOpen}
        toggle={() => {
          console.log(stockByFoodStampId);
          setModalOpen(!isModalOpen);
        }}
      >
        <ModalHeader toggle={() => setModalOpen(!isModalOpen)}>Produtos</ModalHeader>
        <ModalBody>
          {stockByFoodStampId.length > 0 ? (
            <table>
              <tr>
                <th>Nome</th>
                <th>NCM</th>
                <th />
              </tr>
              {stockByFoodStampId.map((product) => {
                console.log(product);
                return (
                  <tr key={product.id}>
                    <td>{product.product.name}</td>
                    <td>{product.product.ncm.ncm_code}</td>
                    <td>
                      <Button
                        onClick={() => {
                          product.food_stamp_id = null;
                          props.updateProduct(foodStampId, product);
                        }}
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </table>
          ) : (
            <div>Ainda não há produtos na cesta</div>
          )}
        </ModalBody>
        <ModalFooter>
          &nbsp;
          <Button
            color="secondary"
            onClick={() => {
              setModalOpen(!isModalOpen);
            }}
          >
            Sair
          </Button>
        </ModalFooter>
      </Modal>
      <Card className="w-25 shadow-lg">
        <CardHeader className="bg-dark text-white">Cestas básicas</CardHeader>
        <CardBody>
          {user.role.name === AUTHORITIES.ADMIN && (
            <Button
              tag={Link}
              to={`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/viewCestaBasica`}
              className="mb-4 float-right"
              color="success"
            >
              Adicionar
            </Button>
          )}
          <Table
            columns={columns}
            data={foodStamps}
            filterCriteria="name"
            filterBy="nome"
            fetchData={fetchData}
            loading={loading}
            pageCount={Math.ceil(props.totalCount / tablePageSize)}
            totalCount={totalCount}
            currentPage={currentPage}
            canGoToPage={false}
          />
        </CardBody>
      </Card>
    </div>
  );
}

const mapStateToProps = (store: IRootState) => ({
  foodStamps: store.foodStamp.foodStamps,
  user: store.authentication.account,
  loading: store.foodStamp.loading,
  totalCount: store.foodStamp.totalCount,
  deleteFoodStampError: store.foodStamp.deleteFoodStampError,
  deleteFoodStampSuccess: store.foodStamp.deleteFoodStampSuccess,
  stockByFoodStampId: store.stock.stockByFoodStampId,
  totalCountByFoodStampId: store.stock.totalCountByFoodStampId,
});

const mapDispatchToProps = {
  getFoodStamps,
  setToViewFoodStamp,
  getContactById,
  deleteFoodStamp,
  getStockByFoodStampId,
  updateProduct,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(CestaBasica);
