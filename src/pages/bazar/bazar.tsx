import React, { useEffect, useState } from 'react';

import '../../styles/pages/login.scss';
import { connect } from 'react-redux';
import { Button,
  Card,
  CardBody,
  CardHeader } from 'reactstrap';
import { faArrowAltCircleRight, faBoxes, faEdit, faPaperPlane, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getStock, setProductToEdit, setToViewProduct } from '../../shared/reducers/stock.reducer';
import { IRootState } from '../../shared/reducers';
import { setToTransferProduct } from '../../shared/reducers/transfer.reducer';
import { setToTransferProduct as setToTransferFoodStampProduct } from '../../shared/reducers/food-stamp.reducer';
import { formataData } from '../../shared/utils/formataData';
import { AUTHORITIES } from '../../config/constants';
import Table from '../../shared/components/Table';
import { differenceInCalendarDays, endOfToday } from 'date-fns';
import { getProducts, reset } from '../../shared/reducers/product.reducer';

interface IStockProps extends StateProps, DispatchProps, RouteComponentProps {}

function Stock(props: IStockProps) {
  const { products, bazar, stock, user, loading, totalCount } = props;
  const fetchIdRef = React.useRef(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    props.getStock(0, 10);
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
      props.getStock(skip, take);
      props.getProducts(skip, take);
    }
    // eslint-disable-next-line
  }, []);

  const dateCell = (date: string) => {
    if (date) {
      if (differenceInCalendarDays(new Date(date), endOfToday()) > 7) {
        return <div className="bg-success text-white">{formataData(new Date(date))}</div>;
      } else {
        return <div className="bg-danger text-white">{formataData(new Date(date))}</div>;
      }
    }
    return <div>Não aplicável</div>;
  };

  const columns = [
    {
      Header: 'Bazar',
      columns: [
        {
          Header: 'Codigo NCM',
          accessor: 'ncm_code',
        },
        {
          Header: 'Nome',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: productStock } }) => <div>{productStock.name + ' ' + productStock.brand}</div>,
        },
        {
          Header: 'Quantidade',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: productStock } }) => {
            const differenceQuantity = productStock.totalAmount - Number(productStock.minimal_qntt);
            const classNameQuantity =
              differenceQuantity < productStock.minimal_more_products
                ? differenceQuantity > 0
                  ? 'bg-warning text-white'
                  : 'bg-danger text-white'
                : 'bg-success text-white';
            return <div className={classNameQuantity}>{productStock.count + ' ' + productStock.unity_measurement}</div>;
          },
        },
        {
          Header: 'Valor (R$)',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: productStock } }) => <>{'R$' + productStock.valor_product}</>,
        }, // productStock.valor_product
        {
          Header: 'Data de Validade',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: productStock } }) => <>{dateCell(productStock.expiration_date)}</>,
        },
        {
          Header: 'Opções',
          accessor: (originalRow) => originalRow,
          // eslint-disable-next-line react/display-name
          Cell: ({ cell: { value: productStock } }) => (
            <div>
              <Button
                className="mx-3"
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/transferir`}
                outline
                color="secondary"
                onClick={() => props.setToTransferProduct(productStock, productStock.count)}
                title="Transferir produto para setor"
              >
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </Button>
              <Button
                className="mx-3"
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/transferirCesta`}
                outline
                color="secondary"
                onClick={() => props.setToTransferFoodStampProduct(productStock, productStock.count)}
                title="Adicionar produto a cesta"
              >
                <FontAwesomeIcon icon={faBoxes} />
              </Button>
              <Button
              className="mx-3"
                onClick={() => {
                  props.setProductToEdit(productStock);
                  props.history.push(`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/EditValor`);
                }}
                outline
                color="secondary"
                title='Alterar Valor do Produto'
              >
                <FontAwesomeIcon icon={faDollarSign} />
              </Button>
              {/* <Button
                className="mx-3"
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/ProductSold`}
                outline
                color="secondary"
                onClick={() => props.setToTransferFoodStampProduct(productStock, productStock.count)}
                title="Produto Vendido"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button> */}

              <Button
                className="mx-3"
                tag={Link}
                to={`/${user.role.name === AUTHORITIES.BAZAR ? 'bazar' : 'bazar'}/ProductSold`}
                outline
                color="secondary"
                onClick={() => props.setToTransferProduct(productStock, productStock.count)}
                title="Produto Vendido"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </div>
          ),
        },
      ],
    },
  ];
  return (
    <div className="d-flex h-100 align-items-center justify-content-center">
      <Card className="w-90 shadow-lg">
        <CardHeader className="bg-dark text-white">Bazar</CardHeader>
        <CardBody>
          <Table
            columns={columns}
            data={stock}
            filterCriteria="ncm_code"
            filterBy="Codigo NCM"
            fetchData={fetchData}
            loading={loading}
            pageCount={Math.ceil(totalCount / tablePageSize)}
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
  stock: store.stock.stock,
  bazar: store.bazar.productsBazar,
  user: store.authentication.account,
  loading: store.stock.loading,
  products: store.product.products,
  totalCount: store.stock.totalCount,
});
const mapDispatchToProps = {
  getProducts,
  getStock,
  setProductToEdit,
  setToTransferProduct,
  setToTransferFoodStampProduct,
  setToViewProduct,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Stock);
