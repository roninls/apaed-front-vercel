import React, { useEffect, useState } from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from '../../shared/reducers';
import { getLocals, setToViewLocal, deleteLocal, reset } from '../../shared/reducers/local.reducer';
import { getContactById } from '../../shared/reducers/contact.reducer';
import { AUTHORITIES } from '../../config/constants';
import Table from '../../shared/components/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
interface ISetorProps extends StateProps, DispatchProps, RouteComponentProps {}

function Setor(props: ISetorProps) {
  const { locals, user, loading, totalCount, deleteLocalError, deleteLocalSuccess } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    props.getLocals(0, 10);
    // eslint-disable-next-line
  }, []);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getLocals(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      Header: 'Setores',
      columns: [
        {
          Header: 'Nome',
          accessor: 'name',
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: local } }) => (
            <>
              <Button
                onClick={() => {
                  props.setToViewLocal(local);
                  props.getContactById(local.contact_id);
                  props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/viewSetor`);
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
                      props.deleteLocal(local.id);
                      if (deleteLocalSuccess && !deleteLocalError && !loading) {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                          title: 'Setor deletado!',
                          text: 'Setor deletado com sucesso!',
                          icon: 'success',
                        }).then(() => {
                          props.reset();
                          props.history.push('/admin/setor');
                        });
                      }
                    } else if (!deleteLocalSuccess && deleteLocalError && !loading) {
                      const MySwal = withReactContent(Swal);
                      MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao deletar setor! Por favor, tente novamente!',
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
        <CardHeader className="bg-dark text-white">Setores</CardHeader>
        <CardBody>
          {user.role.name === AUTHORITIES.ADMIN && (
            <Button tag={Link} to="/admin/addSetor" className="mb-4 float-right" color="success">
              Adicionar
            </Button>
          )}
          <Table
            columns={columns}
            data={locals}
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
  locals: store.local.locals,
  user: store.authentication.account,
  loading: store.local.loading,
  totalCount: store.local.totalCount,
  deleteLocalSuccess: store.local.deleteLocalSuccess,
  deleteLocalError: store.local.deleteLocalError,
});

const mapDispatchToProps = {
  getLocals,
  setToViewLocal,
  getContactById,
  deleteLocal,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Setor);
