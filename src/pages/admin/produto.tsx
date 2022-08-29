import React, { useEffect, useState } from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from '../../shared/reducers';
import { AUTHORITIES } from '../../config/constants';
import Table from '../../shared/components/Table';
import { getProducts, deleteProduct, setToViewProduct, reset } from '../../shared/reducers/product.reducer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface IProdutoProps extends StateProps, DispatchProps, RouteComponentProps {}

function Produto(props: IProdutoProps) {
  const { products, user, loading, totalCount, deleteProductError, deleteProductSuccess } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    props.getProducts(0, 10);
    // eslint-disable-next-line
  }, []);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getProducts(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      Header: 'Produtos',
      columns: [
        {
          Header: 'Nome',
          accessor: 'name',
        },
        {
          Header: 'Marca',
          accessor: 'brand',
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: product } }) => (
            <>
              <Button
                onClick={() => {
                  props.setToViewProduct(product);
                  props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/viewProduto`);
                }}
                color="info"
              >
                <FontAwesomeIcon icon={faInfo} />
              </Button>

              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Deseja deletar o setor?',
                    confirmButtonText: 'Deletar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      props.deleteProduct(product.id);
                      if (deleteProductSuccess && !deleteProductError && !loading) {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                          title: 'Produto deletado!',
                          text: 'Produto deletado com sucesso!',
                          icon: 'success',
                        }).then(() => {
                          props.reset();
                          props.history.push('/admin/products');
                        });
                      }
                    } else if (!deleteProductSuccess && deleteProductError && !loading) {
                      const MySwal = withReactContent(Swal);
                      MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao deletar produto! Por favor, tente novamente!',
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
      <Card className="w-25 shadow-lg">
        <CardHeader className="bg-dark text-white">Produtos</CardHeader>
        <CardBody>
          {user.role.name === AUTHORITIES.ADMIN && (
            <Button tag={Link} to="/admin/viewProduto" className="mb-4 float-right" color="success">
              Adicionar
            </Button>
          )}
          <Table
            columns={columns}
            data={products}
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
  products: store.product.products,
  user: store.authentication.account,
  loading: store.product.loading,
  totalCount: store.product.totalCount,
  deleteProductError: store.product.deleteProductError,
  deleteProductSuccess: store.product.deleteProductSuccess,
});

const mapDispatchToProps = {
  getProducts,
  setToViewProduct,
  deleteProduct,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Produto);
