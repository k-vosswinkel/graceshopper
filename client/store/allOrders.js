import axios from 'axios';
import history from '../history';

//Action Types
const GET_ALL_ORDERS = 'GET_ALL_ORDERS';
const REMOVE_ORDER = 'REMOVE_ORDER';
const ADD_ORDER = 'ADD_ORDER';
const UPDATE_ORDER = 'UPDATE_ORDER';

//Action Creators
const getAllOrders = orders => ({ type: GET_ALL_ORDERS, orders })
const removeOrder = id => ({ type: REMOVE_ORDER, id })
const addOrder = order => ({ type: ADD_ORDER, order })
const updateOrder = order => ({ type: UPDATE_ORDER, order })

//Reducer
export default (orders = [], action) => {
  switch (action.type) {
    case GET_ALL_ORDERS:
      return [action.orders]

    case REMOVE_ORDER:
      return orders.filter(order => order.id !== action.orderId)

    case ADD_ORDER:
      return [...orders, action.order]

    case UPDATE_ORDER:
      return orders.map(order => (order.id === action.order.id ? action.order : order))

    default:
      return orders
  }
}

//Thunks
export const fetchOrders = () => {
  return dispatch => {
    return axios.get('/api/orders')
      .then(res => res.data)
      .then(orders => {
        dispatch(getAllOrders(orders))
      })
      .catch(err => console.error('Getting all orders unsuccessful', err))
  }
}

export const deleteOrder = id => {
  return dispatch => {
    return axios.delete(`/api/orders/${id}`)
      .then(() => {
        dispatch(removeOrder(id));
        history.push(`/orders`);
      })
      .catch(err => console.error(`error deleting order id: ${id})`, err))
  }
}

export const postOrder = order => {
  return dispatch => {
    return axios.post('/api/orders', order)
      .then(newOrder => {
        dispatch(addOrder(newOrder));
        history.push(`/orders/${newOrder.id}`);
      })
      .catch(err => console.error('Creating order unsuccessful', err));
  }
}

export const editOrder = order => {
  return dispatch => {
    return axios.put(`/api/orders/${order.id}`, order)
      .then(res => res.data)
      .then(updatedOrder => {
        dispatch(updateOrder(order))
        history.push(`/orders/${updatedOrder.id}`)
      })
      .catch(err => console.error(`error editing product id: ${order.id}`, err))
  }
}
