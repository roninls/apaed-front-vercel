import React, { useEffect, useState } from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { IRootState } from '../../shared/reducers';
import { deleteDonor, getDonors, setToViewDonor, reset } from '../../shared/reducers/donor.reducer';
import { AUTHORITIES } from '../../config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import Table from '../../shared/components/Table';
import { getContactById } from '../../shared/reducers/contact.reducer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface IFornecedorProps extends StateProps, DispatchProps, RouteComponentProps {}

function Fornecedor(props: IFornecedorProps): JSX.Element {
  const { donors, user, loading, totalCount, deleteDonorError, deleteDonorSuccess } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    props.getDonors(0, 10);
    // eslint-disable-next-line
  }, []);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getDonors(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      Header: 'Doador/Fornecedor',
      columns: [
        {
          Header: 'Nome',
          accessor: 'name',
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: donor } }) => (
            <>
              <Button
                onClick={() => {
                  props.setToViewDonor(donor);
                  props.getContactById(donor.contact_id);
                  props.history.push(`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/viewFornecedor`);
                }}
                color="info"
              >
                <FontAwesomeIcon icon={faInfo} />
              </Button>

              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Deseja deletar o Fornecedor?',
                    confirmButtonText: 'Deletar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      props.deleteDonor(donor.id);
                      if (deleteDonorSuccess && !deleteDonorError && !loading) {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                          title: 'Fornecedor deletado!',
                          text: 'Fornecedor deletado com sucesso!',
                          icon: 'success',
                        }).then(() => {
                          props.reset();
                          props.history.push('/admin/fornecedor');
                        });
                      }
                    } else if (!deleteDonorSuccess && deleteDonorError && !loading) {
                      const MySwal = withReactContent(Swal);
                      MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao deletar fornecedor! Por favor, tente novamente!',
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
        <CardHeader className="bg-dark text-white">Fornecedores</CardHeader>
        <CardBody>
          <Button
            tag={Link}
            to={`/${user.role.name === AUTHORITIES.ADMIN ? 'admin' : 'user'}/addFornecedor`}
            className="mb-4 float-right"
            color="success"
          >
            Adicionar
          </Button>
          <Table
            columns={columns}
            data={donors}
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
  donors: store.donor.donors,
  user: store.authentication.account,
  loading: store.donor.loading,
  totalCount: store.donor.totalCount,
  deleteDonorError: store.donor.deleteDonorError,
  deleteDonorSuccess: store.donor.deleteDonorSuccess,
});

const mapDispatchToProps = {
  getDonors,
  setToViewDonor,
  getContactById,
  deleteDonor,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Fornecedor);
