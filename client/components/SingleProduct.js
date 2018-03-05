import React, {Component} from 'react'
import {deleteProduct} from '../store/allProducts'
import {fetchCurrentProduct} from '../store/currentProduct'
import NewProduct from './NewProduct';
// import Reviews from './Reviews';
import {connect} from 'react-redux';
import {postOrder} from '../store/allOrders';
import {postLineItem} from '../store/allLineItems';
import Reviews from './Reviews';

class SingleProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProduct: this.props.currentProduct,
      isEditing: false
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    const productId = Number(this.props.match.params.productId)
    this.props.fetchCurrentProduct(productId)
  }

  componentWillReceiveProps(newProps, oldProps) {
    if (newProps.currentProduct !== oldProps.currentProduct) {
      this.setState({
        currentProduct: newProps.currentProduct
      })
    }
  }

  handleEdit() {
    this.setState({isEditing: !this.state.isEditing})
  }

  handleDelete (event) {
    event.preventDefault()
    this.props.deleteProduct(this.state.currentProduct.id)
  }

  handleAdd(event) {
    event.preventDefault();
    const {currentProduct, currentOrder, currentUser} = this.props;
    let newLineItem = {
      quantity: 1,
      productId: currentProduct.id
    }
    if (!Object.keys(currentUser).length) {
      return null;
    }

    else if (!Object.keys(currentOrder).length) {
      this.props.postOrder({status: 'Pending', userId: currentUser.id}, [newLineItem]);
    }
    else {
      newLineItem['orderId'] = currentOrder.id;
      this.props.postLineItem(currentOrder.id, [newLineItem]);
    }
  }

  render() {
    const currentUser = this.state.currentUser;
    const currentProduct = this.state.currentProduct;
    const reviews = currentProduct.reviews || [];
    if (!currentProduct) return <div />; // the product id is invalid or the data isnt loaded yet

    if (this.state.isEditing) {
      return (
        <NewProduct product={this.state.currentProduct} handleEdit={this.handleEdit} />
      )
    }

     else {
      return (
      <div>
        <div>
          <div className="page-header">
            <h2>{currentProduct.name}</h2>
            {/* only admins can see inventory, edit, or delete: */}
            {/* {currentUser.isAdmin && <div className="page-body">} */}
              { this.props.currentUser.admin ? <p> Current Inventory: {currentProduct.inventory} </p> : null }
              <button onClick={this.handleEdit} className="btn btn-warning new">Edit Product </button>
              <button onClick={this.handleDelete} className="btn btn-danger new">Delete Product</button>
          </div>
        </div>

          <div className="page-body">
              <button className="btn btn-success new" onClick={this.handleAdd}>Add To Cart</button>
              <p>Price: {currentProduct.price} </p>
              <p>Description: {currentProduct.description} </p>
              <ul>Categories: {currentProduct.categories && currentProduct.categories.map(category => {
                  return (
                    <li key={category.id}>{category.name}</li>
                    )
                  })
                 }
                </ul>
              <img src={currentProduct.imageUrl} />
          </div>

          <div>
              {/* <h5>Average Rating</h5>
              {currentProduct.reviews && currentProduct.reviews.length
               ? <p>Average Rating: {currentProduct.reviews.reduce((acc, currVal) => acc + currVal.rating, 0) / currentProduct.reviews.length}</p>
               : <p> No ratings </p>
              }
               <h5>All Ratings </h5> */}
               <Reviews />
          </div>
      </div>

      )
    }
  }
}

const mapState = ({currentProduct, currentUser, currentOrder}) => ({currentProduct, currentUser, currentOrder})

//commented out temporarily - AS
// const mapStateToProps = ({currentProduct, currentUser}) => {
//   const productReviews = currentProduct.reviews.filter(review => review.productId === currentProduct.id)
//   return {currentProduct, currentUser, productReviews}
// }

const mapDispatch = {fetchCurrentProduct, deleteProduct, postLineItem, postOrder}

export default connect(mapState, mapDispatch)(SingleProduct)
