import React, { useMemo, useState } from 'react';
import { IRootState } from '../../shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Table from '../../shared/components/Table';
import { getTransfers } from '../../shared/reducers/transfer.reducer';
import { formataData } from '../../shared/utils/formataData';

interface ITransfersProps extends StateProps, DispatchProps, RouteComponentProps {}

function Transfers(props: ITransfersProps): JSX.Element {
  const columns = useMemo(
    () => [
      {
        Header: 'Transferências',
        columns: [
          {
            Header: 'Descrição',
            accessor: 'description',
          },
          {
            Header: 'Código NCM',
            accessor: 'product_ncm_code',
          },
          {
            Header: 'Nome',
            accessor: 'product_name',
          },
          {
            Header: 'Marca',
            accessor: 'product_brand',
          },
          {
            Header: 'Quantidade',
            accessor: 'total_amount_transfered',
          },
          {
            Header: 'Destino',
            accessor: 'destiny.name',
          },
          {
            Header: 'Data',
            accessor: 'transfer_date',
            // eslint-disable-next-line react/display-name
            Cell: ({ cell: { value } }) => <span>{formataData(new Date(`${value}T00:00:00`))}</span>,
          },
        ],
      },
    ],
    [],
  );

  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setTablePageSize(pageSize);
      setCurrentPage(pageIndex);
      const skip = pageIndex * pageSize;
      const take = pageSize;
      props.getTransfers(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="m-3">
      <Table
        columns={columns}
        data={props.transfers}
        filterCriteria="product_ncm_code"
        filterBy="código NCM"
        fetchData={fetchData}
        loading={props.loading}
        pageCount={Math.ceil(props.totalCount / tablePageSize)}
        totalCount={props.totalCount}
        currentPage={currentPage}
        canGoToPage={true}
      />
    </div>
  );
}

const mapStateToProps = (store: IRootState) => ({
  transfers: store.transfer.transfers,
  loading: store.transfer.loading,
  totalCount: store.transfer.totalCount,
});
const mapDispatchToProps = {
  getTransfers,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
