import React from 'react';
import './App.css';
import Header from './Header';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
import {
Modal,
Button
} from 'react-bootstrap';
import LivePos from './LivePos';

const HOST = 'http://localhost:8098';
let socket = io.connect(HOST);

class Pos extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        items: [],
        quantity: 1,
        id: 0,
        open: true,
        close: false,
        addItemModal: false,
        checkOutModal: false,
        amountDueModal: false,
        receiptModal: false,
        totalPayment: 0,
        total: 0,
        changeDue: 0,
        name: "",
        price: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
}
componentDidUpdate() {
    if (this.state.items.length != 0) {
        socket.emit("update-live-cart", this.state.items);
    }
}
handleSubmit = e => {
    e.preventDefault();
    this.setState({
        addItemModal: false
    });

    const currentItem = {
        id: this.state.id++,
        name: this.state.name,
        price: this.state.price,
        quantity: this.state.quantity
    };
    let items = this.state.items;
    items.push(currentItem);
    this.setState({
        items: items
    });
}
handleName = e => {
    this.setState({
        name: e.target.value
    });
};
handlePrice = e => {
    this.setState({
        price: e.target.value
    });
};
handlePayment = () => {
    this.setState({
        checkOutModal: false
    });
    let amountDiff = parseInt(this.state.total, 10) - parseInt(this.state.totalPayment, 10);
    if (this.state.total <= this.state.totalPayment) {
        this.setState({
            changeDue: amountDiff,
            receiptModal: true,
            items: [],
            total: 0
        });
        this.handleSaveToDB();
    } else {
        this.setState({
            changeDue: amountDiff,
            amountDueModal: true
        });
    }
};
handleQuantityChange = (id, quantity) => {
    let items = this.state.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            items[i].quantity = quantity;
            this.setState({
                items: items
            });
        }
    }
};
handleCheckOut = () => {
    this.setState({
        checkOutModal: true
    })
    let items = this.state.items;
    let totalCost = 0;
    for (let i = 0; i < items.length; i++) {
        let price = items[i].price * items[i].quantity;
        totalCost = parseInt(totalCost, 10) + parseInt(price, 10);
    }
    this.setState({
        total: totalCost
    });
};
handleSaveToDB = () => {
    const transaction = {
        date: moment().format("DD-MM-YYYY HH:mm:ss"),
        total: this.state.total,
        items: this.state.items
    };
    axios.post(HOST + '/api/new', transaction).catch(err => {
        console.log(err);
    });
};
render() {
    let { quantity, modal, items } = this.state;
    let renderAmountDue = () => {
        return(
            <Modal show={this.state.amountDueModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Amount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>
                        Amount Due:
                        <span className="text-danger">{this.state.changeDue}</span>
                    </h3>
                    <p>Customer payment incomplete; Correct and Try again </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ amountDueModal: false})}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    };
    let renderReceipt = () => {
        return(
            <Modal show={this.state.receiptModal}>
            <Modal.Header closeButton>
                <Modal.Title>Receipt</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>
                    Total:
                    <span className="text-danger">{this.state.totalPayment}</span>
                </h3>
                <h3>
                    Total:
                    <span className="text-danger">{this.state.changeDue}</span>
                </h3>
                <p>Customer payment incomplete; Correct and Try again </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => this.setState({ amountDueModal: false})}>Close</Button>
            </Modal.Footer>
        </Modal>
        );
    };
    let renderLivePos = () => {
        if (items.length === 0) {
            return <p>No products added</p>
        }
        else {
            return items.map(item => (
                <LivePos {...item} onQuantityChange={this.handleQuantityChange} />
            ), this);
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="text-center">
                    <span class="lead">Total</span>
                    <br />
                    <span class="text-success checkout-total-price">
                        ${this.state.total}
                        <span />
                    </span>
                    <div>
                        <button className="btn btn-success lead" id="checkoutButton" onClick={this.handleCheckOut}>
                        <i className="glyphicon glyphicon-shopping-cart" />
                        <br />
                        <br />
                        C <br />
                        h <br />
                        e <br />
                        c <br />
                        k <br />
                        o <br />
                        u <br />
                        t
                        </button>
                        <div className="modal-body">
                            <Modal show={this.state.checkOutModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Checkout</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="lead">
                                        <h3>
                                            Total:
                                            <span className="text-danger">{this.state.total}</span>
                                        </h3>
                                        <form className="form-horizontal" name="checkoutForm" onSubmit={this.handlePayment}>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <div className="input-group-addon">$</div>
                                                    <input type="number" id="checkoutPaymentAmount" className="form-control input-lg" name="payment" onChange={event => {
                                                        this.setState({
                                                            totalPayment: event.target.value
                                                        });
                                                    }} min="0" />
                                                </div>
                                            </div>
                                            <p className="text-danger">Enter payment amount</p>
                                            <div className="lead" />
                                            <Button className="btn btn-primary btn-lg lead" onClick={this.handlePayment}>Print Receipt</Button>
                                        </form>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => this.setState({ checkOutModal: false })}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
                {renderAmountDue()}
                {renderReceipt()}
                <table className="pos table table-responsive table-striped table-hover">
                  <thead>
                      <tr>
                          <td colSpan="6" className="text-center">
                            <span className="pull-left">
                            <button onClick={() => this.setState({addItemModal: true})} className="btn btn-default btn-sm"><i className="glyphicon glyphicon-plus">Add Item</i></button>
                            </span>
                            <Modal show={this.state.addItemModal} onHide={this.close}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Add Item (Product)</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form ref="form" onSubmit={this.handleSubmit} className="form-horizontal">
                                     <div className="form-group">
                                       <label className="col-md-2 lead" for="name">Name</label>
                                       <div className="col-md-8 input-group">
                                        <input className="form-control" name="name" required onChange={this.handleName} />
                                       </div>
                                     </div>
                                     false
                                     <div class="form-group">
                                    <label class="col-md-2 lead" for="price">
                                        Price
                                    </label>
                                    <div class="col-md-8 input-group">
                                        <div class="input-group-addon">$</div>
                                        <input type="number" step="any" min="0" onChange= {this.handlePrice} class="form-control" name="price" required />
                                    </div>
                                    </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={this.handleSubmit}>Add</Button>
                                    <Button onClick={() => this.setState({ addItemModal: false})}>Cancel</Button>
                                </Modal.Footer>
                            </Modal>
                          </td>
                      </tr>
                      <tr className="titles">
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Tax</th>
                        <th>Total</th>
                        <th />
                      </tr>
                  </thead>
                  <tbody>{renderLivePos()}</tbody>
                </table>
            </div>
        </div>
    );
}
}

export default Pos;