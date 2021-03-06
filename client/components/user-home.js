import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { fetchOrders } from '../store/allOrders'

//Component
class UserHome extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: props.email
    }
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  render(){
    let userOrders = this.props.orders.filter(order => {
      return order.userId === this.props.userId && order.status !== 'Pending'
    })
    if (!userOrders.length){
      return (
        <div className="form-login">
          <h2 className="header">Welcome {this.state.email}!</h2>
          <div className="subHeader">You Have No Orders</div>
        </div>
      )
    } else {
     return (
      <div className="orders-list">
         <h2 className="header">Welcome, {this.state.email}</h2>
         <h2 className="subHeader">Your Orders:</h2>
         {
           userOrders.map(order => {
            return (
              <div key={order.id} className="order-item product col-xs-2">
                <div><p>Account email: {order.email}</p></div>
                <div><p>Shipping address: {order.shippingAddress}</p></div>
                <div><p>Order status: {order.status}</p></div>
                <div><p>Date placed: {order.orderDate.slice(0, 10)}</p></div>
              </div>
            )
          })
        }
      </div>
    )
    }
  }
}

//Container
const mapState = (state) => {
  return {
    userId: state.currentUser.id,
    email: state.currentUser.email,
    orders: state.allOrders
  }
}

const mapDispatch = { fetchOrders }

export default connect(mapState, mapDispatch)(UserHome)

//Prop Types
UserHome.propTypes = {
  email: PropTypes.string
}
