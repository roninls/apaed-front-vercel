import React, { useEffect, useState } from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { deleteUser, getUsers, reset, setToViewUser } from '../../shared/reducers/user.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import Table from '../../shared/components/Table';
import { getContactById } from '../../shared/reducers/contact.reducer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface IUsersProps extends StateProps, DispatchProps, RouteComponentProps {}

function Users(props: IUsersProps): JSX.Element {
  const { users, loading, deleteUserSuccess, deleteUserError, totalCount } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    props.getUsers(0, 10);
    // eslint-disable-next-line
  }, []);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getUsers(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      Header: 'Usuários',
      columns: [
        {
          Header: 'Nome',
          accessor: 'name',
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: user } }) => (
            <>
              <Button
                onClick={() => {
                  props.setToViewUser(user);
                  props.history.push(`/admin/viewUser`);
                }}
                color="info"
              >
                <FontAwesomeIcon icon={faInfo} />
              </Button>

              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Deseja deletar o Usuário?',
                    confirmButtonText: 'Deletar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      props.deleteUser(user.id);
                      if (deleteUserSuccess && !deleteUserError && !loading) {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                          title: 'Usuário deletado!',
                          text: 'Usuário deletado com sucesso!',
                          icon: 'success',
                        }).then(() => {
                          props.reset();
                          props.history.push('/admin/users');
                        });
                      }
                    } else if (!deleteUserSuccess && deleteUserError && !loading) {
                      const MySwal = withReactContent(Swal);
                      MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao deletar usuário! Por favor, tente novamente!',
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
        <CardHeader className="bg-dark text-white">Usuários</CardHeader>
        <CardBody>
          <Button tag={Link} to={`/admin/viewUser`} className="mb-4 float-right" color="success">
            Adicionar
          </Button>
          <Table
            columns={columns}
            data={users}
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
  loading: store.user.loading,
  totalCount: store.user.totalCount,
  deleteUserError: store.user.deleteUserError,
  deleteUserSuccess: store.user.deleteUserSuccess,
  users: store.user.users,
});

const mapDispatchToProps = {
  getUsers,
  setToViewUser,
  getContactById,
  deleteUser,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Users);
