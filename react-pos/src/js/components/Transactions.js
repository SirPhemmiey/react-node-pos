import React from 'react';
import './App/css';
import Header from './Header';
import CompleteTransactions from './CompleteTransactions';
import axios from 'axios';

const HOST = "http://localhost:8098";
const url = HOST + '/api/all';

class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        };
    }
    componentWillMount() {
        axios.get(url).then(response => {
            this.setState({ transactions: response.data });
            console.log(response.data);
        });
    }
    render() {
        let { transactions } = this.state;
        let renderTransactions = () => {
            if (transactions == 0) {
                return <p>No Transactions found</p>
            }
            return transactions.map(transaction => {
                <CompleteTransactions {...transaction}/>
            })
        };

        return(
            <div>
                <Header />
                <div className="text-center">
                    <span>Today Sales</span>
                    <br/>
                    <span className="text-success checkout-total-price">$ <span /></span>
                </div>
                <br/> <br/>
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Total</th>
                            <th>Products</th>
                            <th>Open</th>
                        </tr>
                    </thead>
                    <tbody>{renderTransactions()}</tbody>
                </table>
            </div>
        );
    }
}
export default Transactions;