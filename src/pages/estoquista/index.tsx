import React from 'react';

import ErrorBoundaryRoute from '../../shared/error/error-boundary-route';

import { Switch } from 'react-router-dom';
import PageNotFound from '../../shared/error/page-not-found';
import Estoque from '../shared/estoque';
import Fornecedor from '../shared/fornecedor';
import Setor from '../shared/setor';
import AddFornecedor from '../shared/formFornecedor';
import VerSetor from '../shared/formSetor';
import Transferir from '../shared/transferir';
import AddProduto from '../shared/addProduto';
import AddTipoProduto from '../shared/addTipoProduto';
import AddCategoria from '../shared/addCategoria';
import CestaBasica from 'pages/shared/cestaBasica';
import FormCestaBasica from 'pages/shared/formCestaBasica';
import TransferirCesta from 'pages/shared/transferirCesta';

const Routes = ({ match }) => (
  <Switch>
    <ErrorBoundaryRoute path={`${match.url}/estoque`} component={Estoque} />
    <ErrorBoundaryRoute path={`${match.url}/fornecedor`} component={Fornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/setor`} component={Setor} />
    <ErrorBoundaryRoute path={`${match.url}/addFornecedor`} component={AddFornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/viewFornecedor`} component={AddFornecedor} />
    <ErrorBoundaryRoute path={`${match.url}/viewSetor`} component={VerSetor} />
    <ErrorBoundaryRoute path={`${match.url}/transferir`} component={Transferir} />
    <ErrorBoundaryRoute path={`${match.url}/addProduto`} component={AddProduto} />
    <ErrorBoundaryRoute path={`${match.url}/viewProduto`} component={AddTipoProduto} />
    <ErrorBoundaryRoute path={`${match.url}/addCategoria`} component={AddCategoria} />
    <ErrorBoundaryRoute path={`${match.url}/cestaBasica`} component={CestaBasica} />
    <ErrorBoundaryRoute path={`${match.url}/viewCestaBasica`} component={FormCestaBasica} />
    <ErrorBoundaryRoute path={`${match.url}/transferirCesta`} component={TransferirCesta} />
    <ErrorBoundaryRoute component={PageNotFound} />
  </Switch>
);

export default Routes;
