import React, { Component } from 'react';
import './App.css';

class RecentTransaction extends Component {
    render() {
        const {total, date} = this.props;
        return(
            <tr>
                <td className="col-md-2">
                    <a href="#/transaction/{{transaction._id}}">{date}</a>
                </td>
                <td className="col-md-2">{total}</td>
            </tr>
        );
    }
}

export default RecentTransaction;