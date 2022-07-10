import React, { Component } from 'react'
import { connect } from 'react-redux'
import Surface from '../images/Surface.svg'
import cartIcon from '../images/cartIcon/Vector-2.svg'
import cartIcon2 from '../images/cartIcon/Vector.svg'
import { addToCart } from '../actions/cartAction'
import { Link } from 'react-router-dom'
import { showOverlay } from '../actions/overlayAction'
import { hideOverlay } from '../actions/overlayAction'

const mapStateToProps = (props) => {
    return {
      categories: props.storeCategories,
      category: props.currentCategory,
      currentCurrency: props.currentCurrency,
      cartItems: props.cartItems
    }
  }

const mapDispatchToProps = () => {
  return {
    addToCart,
    showOverlay,
    hideOverlay
  }
}

class ShopList extends Component {

  state = {
    hoveredItem: ''
  }

  showCart = (id) => {
    this.setState(() => {
      return {
        hoveredItem: id
      }
    })
  }

  hideCart = (id) => {
    this.setState(() => {
      return {
        hoveredItem: ''
      }
    })
  }

  addToCart = (productItem, stockStatus) => {
    if (stockStatus && !this.props.cartItems.some((el) => el.id === productItem.id)) {
      this.props.addToCart(productItem);

      setTimeout(() => {
        this.props.showOverlay();
      }, 100)

      setTimeout(() => {
        this.props.hideOverlay();
      }, 1000)
    }
  }

  

  render() {
    return (
      <div className='Shop'>
        <h1>{ this.props.category.name }</h1>

        <div className='productList-container'>
        {this.props.categories[this.props.category.index] && this.props.categories[this.props.category.index].products.map((product) => (
            <div className='productList' key={product.id}>
                <div className="item-container" onMouseEnter={() => this.showCart(product.id)} onMouseLeave={() => this.hideCart(product.id)}>
                    <div className="image-container">
                        {this.state.hoveredItem === product.id ? <div className='cartIcon-container' onClick={() => this.addToCart(product, product.inStock)}>
                          <img src={Surface} alt="green background surface" className='surface' />
                          <img src={cartIcon2} alt="cart icon" className='cartIcon' />
                          <img src={cartIcon} alt="cart icon" className='cartIcon2' />
                          <img src={cartIcon} alt="cart icon" className='cartIcon3' />
                        </div> : ''}
                        <Link to={`product/${product.id}`}><img src={product.gallery[0]} alt="product image" className='productImage' />{!product.inStock ? <div className='stock-bg'></div> : ''}</Link>
                        {!product.inStock ? <div className='stock'><h1>Out of stock</h1></div> : ''}
                    </div>
                

                    <h3>{ product.brand + " " + product.name }</h3>
                    <h3>{ product.prices[this.props.currentCurrency].currency.symbol + product.prices[this.props.currentCurrency].amount }</h3>
                </div>
            </div>
        ))}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(ShopList)
