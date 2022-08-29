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
import { deleteCategory, getCategories, setToViewCategory, reset } from '../../shared/reducers/category.reducer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ICategoriaProps extends StateProps, DispatchProps, RouteComponentProps {}

function Categoria(props: ICategoriaProps) {
  const { categories, user, loading, totalCount, deleteCategoryError, deleteCategorySuccess } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    props.getCategories(0, 10);
    // eslint-disable-next-line
  }, []);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getCategories(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      Header: 'Categorias',
      columns: [
        {
          Header: 'Descrição',
          accessor: 'description',
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: category } }) => (
            <>
              <Button
                onClick={() => {
                  props.setToViewCategory(category);
                  props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/viewCategoria`);
                }}
                color="info"
              >
                <FontAwesomeIcon icon={faInfo} />
              </Button>

              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Deseja deletar a categoria?',
                    confirmButtonText: 'Deletar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      props.deleteCategory(category.id);
                      if (deleteCategorySuccess && !deleteCategoryError && !loading) {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                          title: 'Categoria deletado!',
                          text: 'Categoria deletado com sucesso!',
                          icon: 'success',
                        }).then(() => {
                          props.reset();
                          props.history.push('/admin/categories');
                        });
                      }
                    } else if (!deleteCategorySuccess && deleteCategoryError && !loading) {
                      const MySwal = withReactContent(Swal);
                      MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao deletar categoria! Por favor, tente novamente!',
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
        <CardHeader className="bg-dark text-white">Categorias</CardHeader>
        <CardBody>
          {user.role.name === AUTHORITIES.ADMIN && (
            <Button tag={Link} to="/admin/viewCategoria" className="mb-4 float-right" color="success">
              Adicionar
            </Button>
          )}
          <Table
            columns={columns}
            data={categories}
            filterCriteria="description"
            filterBy="descrição"
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
  categories: store.category.categories,
  user: store.authentication.account,
  loading: store.category.loading,
  totalCount: store.category.totalCount,
  deleteCategoryError: store.category.deleteCategoryError,
  deleteCategorySuccess: store.category.deleteCategorySuccess,
});

const mapDispatchToProps = {
  getCategories,
  setToViewCategory,
  deleteCategory,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Categoria);
