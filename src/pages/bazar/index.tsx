import React from 'react';

import ErrorBoundaryRoute from '../../shared/error/error-boundary-route';

import { Switch } from 'react-router-dom';
import PageNotFound from '../../shared/error/page-not-found';
import Forner from './fornecedor';
import Setor from '../shared/setor';
import Bazar from './bazar';
import Estoque from './estoque';
import AddFornecedor from '../shared/formFornecedor';
import VerSetor from '../shared/formSetor';
import Transferir from './transferir';
import EditValorProduct from './edit_valor_product';
import AddProduto from './addProduto';
import AddTipoProduto from './addTipoProduto';
import viewCategoria from './addCategoria';
import CestaBasica from 'pages/shared/cestaBasica';
import FormCestaBasica from 'pages/shared/formCestaBasica';
import TransferirCesta from './transferirCesta';
import Transfers from 'pages/admin/transfers_bkp';
import Historico from 'pages/admin/transfers';
import ProductSold from './produtos_vendidos';

const Routes = ({ match }) => (
  <Switch>
    <ErrorBoundaryRoute path={`${match.url}/fornecedor`} component={Forner} />
    <ErrorBoundaryRoute path={`${match.url}/setor`} component={Setor} />
    <ErrorBoundaryRoute path={`${match.url}/addFornecedor`} component={AddFornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/viewFornecedor`} component={AddFornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/Bazar`} component={Bazar} />
    <ErrorBoundaryRoute path={`${match.url}/Estoque`} component={Estoque} />
    <ErrorBoundaryRoute path={`${match.url}/viewSetor`} component={VerSetor} />
    <ErrorBoundaryRoute path={`${match.url}/transferir`} component={Transferir} />
    <ErrorBoundaryRoute path={`${match.url}/EditValor`} component={EditValorProduct} />
    <ErrorBoundaryRoute path={`${match.url}/addProduto`} component={AddProduto} />
    <ErrorBoundaryRoute path={`${match.url}/addTipoProduto`} component={AddTipoProduto} />
    <ErrorBoundaryRoute path={`${match.url}/viewCategoria`} component={viewCategoria} />
    <ErrorBoundaryRoute path={`${match.url}/cestaBasica`} component={CestaBasica} />
    <ErrorBoundaryRoute path={`${match.url}/viewCestaBasica`} component={FormCestaBasica} />
    <ErrorBoundaryRoute path={`${match.url}/transferirCesta`} component={TransferirCesta} />
    <ErrorBoundaryRoute path={`${match.url}/transfers`} component={Transfers} />
    <ErrorBoundaryRoute path={`${match.url}/historico`} component={Historico} />
    <ErrorBoundaryRoute path={`${match.url}/ProductSold`} component={ProductSold} />
    <ErrorBoundaryRoute component={PageNotFound} />
  </Switch>
);

export default Routes;
