import React from 'react';
import './App.css';

class LivePos extends React.Component {

    handleChange = (id, itemNumber) => {
        this.props.onChange(id, itemNumber);
    }
    render() {
        const { id, name, price, quantiy } = this.props;
        let itemNumber = quantiy;
        return (
            <tr>
                <td className="col-md-2">{name}</td>
                <td className="col-md-2">${price}</td>
                <td className="col-md-2">
                    <button className="btn btn-sm pull-left" onClick={() => this.handleChange(id, --itemNumber)}>
                    <i className="glyphicon glyphicon-minus"></i>
                    </button>
                </td>
                <div className="col-md-6">
                    <input type="number" value={itemNumber} id=""/>
                </div>
                <td className="col-md-2">
                    <button className="btn btn-sm pull-left" onClick={() => this.handleChange(id, ++itemNumber)}>
                    <i className="glyphicon glyphicon-plus"></i>
                    </button>
                </td>
                <td className="col-md-6">$0.00</td>
                <td className="col-md-6">{price}</td>
                <td className="col-md-6">
                    <button className="btn btn-danger" onClick={() => this.handleChange(id, "delete")}>
                    <i className="glyphicon glyphicon-trash"></i>
                    </button>
                </td>
            </tr>
        );
    }
}

export default LivePos;