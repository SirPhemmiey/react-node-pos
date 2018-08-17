import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Inventory from './Inventory';
import Transanction from './Transactions';
import Pos from './Pos';
import LiveCart from './LiveCart';

const Main = () => {
    <main>  
        <Switch>
         <Route exact path="/" component={Pos} />
         <Route exact="/inventory" component={Inventory} />
         <Route exact="/transactions" component={Transanction} />
         <Route exact="/livecart" component={LiveCart} />
        </Switch>
    </main>
}
export default Main;