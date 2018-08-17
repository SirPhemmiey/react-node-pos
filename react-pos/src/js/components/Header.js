import React from 'react';
import { Link } from 'react-router-dom';

//The header creates a link that can be used to navigate btw routes

const Header = () => {
    <div className="text-center">
        <h1>
            <a href="/#/">Real Time Point POS</a>
        </h1>
        <ul className="nav-menu">
            <li className="lead">
                <Link to="/inventory">Inventory</Link>
            </li>
            <li className="lead">
                <Link to="/">POS</Link>
            </li>
            <li className="lead">
                <Link to="/transactions">Transactions</Link>
            </li>
            <li className="lead">
                <Link to="/livecart">LiveCart</Link>
            </li>
        </ul>
    </div>
}