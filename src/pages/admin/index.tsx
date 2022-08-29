import React from 'react';

import ErrorBoundaryRoute from '../../shared/error/error-boundary-route';

import { Switch } from 'react-router-dom';
import PageNotFound from '../../shared/error/page-not-found';
import Fornecedor from '../shared/fornecedor';
import Estoque from 'pages/shared/estoque';
import FormFornecedor from 'pages/shared/formFornecedor';
import FormSetor from 'pages/shared/formSetor';
import Setor from 'pages/shared/setor';
import Transferir from '../shared/transferir';
import Transfers from './transfers_bkp';
import Historico from './transfers';
import Categoria from './categoria';
import ViewCategoria from '../shared/addCategoria';
import AddTipoProduto from '../shared/addTipoProduto';
import Products from './produto';
import AddProduto from '../shared/addProduto';
import CestaBasica from 'pages/shared/cestaBasica';
import FormCestaBasica from 'pages/shared/formCestaBasica';
import TransferirCesta from 'pages/shared/transferirCesta';
import ProductSold from 'pages/shared/produtos_vendidos';
import Users from './users';
import ViewUser from './formUsers';

const Routes = ({ match }) => (
  <Switch>
    <ErrorBoundaryRoute path={`${match.url}/users`} component={Users} />
    <ErrorBoundaryRoute path={`${match.url}/viewUser`} component={ViewUser} />
    <ErrorBoundaryRoute path={`${match.url}/estoque`} component={Estoque} />
    <ErrorBoundaryRoute path={`${match.url}/transferir`} component={Transferir} />
    <ErrorBoundaryRoute path={`${match.url}/ProductSold`} component={ProductSold} />
    <ErrorBoundaryRoute path={`${match.url}/addProduto`} component={AddProduto} />
    <ErrorBoundaryRoute path={`${match.url}/fornecedor`} component={Fornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/addFornecedor`} component={FormFornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/viewFornecedor`} component={FormFornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/setor`} component={Setor} />
    <ErrorBoundaryRoute path={`${match.url}/viewSetor`} component={FormSetor} />
    <ErrorBoundaryRoute path={`${match.url}/addSetor`} component={FormSetor} />
    <ErrorBoundaryRoute path={`${match.url}/transfers`} component={Transfers} />
    <ErrorBoundaryRoute path={`${match.url}/historico`} component={Historico} />
    <ErrorBoundaryRoute path={`${match.url}/categories`} component={Categoria} />
    <ErrorBoundaryRoute path={`${match.url}/viewCategoria`} component={ViewCategoria} />
    <ErrorBoundaryRoute path={`${match.url}/products`} component={Products} />
    <ErrorBoundaryRoute path={`${match.url}/viewProduto`} component={AddTipoProduto} />
    <ErrorBoundaryRoute path={`${match.url}/cestaBasica`} component={CestaBasica} />
    <ErrorBoundaryRoute path={`${match.url}/viewCestaBasica`} component={FormCestaBasica} />
    <ErrorBoundaryRoute path={`${match.url}/transferirCesta`} component={TransferirCesta} />
    <ErrorBoundaryRoute component={PageNotFound} />
  </Switch>
);

export default Routes;
