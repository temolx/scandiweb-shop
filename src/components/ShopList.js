import React, { Component } from 'react'
import { connect } from 'react-redux'
import Surface from '../images/Surface.svg'
import cartIcon from '../images/cartIcon/Vector-2.svg'
import cartIcon2 from '../images/cartIcon/Vector.svg'
import { addToCart } from '../actions/cartAction'
import { Link } from 'react-router-dom'
import { showOverlay } from '../actions/overlayAction'
import { hideOverlay } from '../actions/overlayAction'
import { request } from 'graphql-request';
import { CATEGORY } from '..'
import { checkAttribute } from '../actions/cartAction'
import { addAttribute } from '../actions/cartAction'
import { increment } from '../actions/cartAction';

const mapStateToProps = (props) => {
    return {
      category: props.currentCategory,
      currentCurrency: props.currentCurrency,
      cartItems: props.cartItems,
      checkStatus: props.checkStatus,
    }
  }

const mapDispatchToProps = () => {
  return {
    addToCart,
    showOverlay,
    hideOverlay,
    checkAttribute,
    addAttribute,
    increment
  }
}

class ShopList extends Component {

  state = {
    hoveredItem: '',
    currentCategoryItems: '',
    testUpdate: false
  }

  componentDidMount() {
    request('http://localhost:4000/graphql', CATEGORY, {
      input: { title: this.props.category.name }
    }).then((data) => {
      // console.log(data.category);

      this.setState(() => {
        return {
          currentCategoryItems: data.category
        }
      })
    })
  }

  componentDidUpdate() {
    if (this.props.category.name !== this.state.currentCategoryItems.name) {
      request('http://localhost:4000/graphql', CATEGORY, {
        input: { title: this.props.category.name }
      }).then((data) => {
        console.log(data.category);

        this.setState(() => {
          return {
            currentCategoryItems: data.category
          }
        })
      })
    }
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
    const item = {
      ...productItem,
      quantity: 1
    }

    if (stockStatus && !this.props.cartItems.some((el) => el.id === productItem.id)) {
      this.props.addToCart(item);

      setTimeout(() => {
        this.props.showOverlay();
      }, 100)

      setTimeout(() => {
        this.props.hideOverlay();
      }, 1000)


      if (this.props.checkStatus.length === 0) {
        this.props.checkAttribute({attributes: productItem.attributes.map((attribute) => {
          return {
              id: attribute.id,
              active: attribute.items[1].value
            }
            }), 
            productID: productItem.id,
            itemIndex: this.props.cartItems.length
          })

      }
      else {
        this.props.addAttribute({attributes: productItem.attributes.map((attribute) => {
          return {
              id: attribute.id,
              active: attribute.items[1].value
            }
            }),
            productID: productItem.id,
            itemIndex: this.props.cartItems.length
          })
      }
    }

    else if (this.props.cartItems.some((el) => el.id === productItem.id)) {
      // same item, different attribute configuration
      if (!this.props.checkStatus.some((el) => el.attributes.every((attribute, index) => attribute.active === productItem.attributes[index].items[1].value))) {
  
        this.props.addToCart(item);
  
        setTimeout(() => {
          this.props.showOverlay();      
        }, 100)
    
        setTimeout(() => {
          this.props.hideOverlay();
        }, 1000)
      
        
        this.props.addAttribute({attributes: productItem.attributes.map((attribute) => {
          return {
              id: attribute.id,
              active: attribute.items[1].value
            }
            }),
            productID: productItem.id,
            itemIndex: this.props.cartItems.length
          })
      }

      // same item, same attribute configuration
      else {
        let myIndex = this.props.checkStatus.findIndex((el) => el.productID === productItem.id && el.attributes.every((attribute, index) => attribute.active === productItem.attributes[index].items[1].value));

        this.props.increment(productItem.id, myIndex);
      }
    }
  }

  

  render() {
    return (
      <div className='Shop'>
        <h1>{ this.props.category.name }</h1>

        <div className='productList-container'>
        {this.state.currentCategoryItems.products && this.state.currentCategoryItems.products.map((product, index) => (
            <div className='productList' key={ product.id }>
                <div className="item-container" onMouseEnter={() => this.showCart(product.id)} onMouseLeave={() => this.hideCart(product.id)}>
                    <div className="image-container">
                        {this.state.hoveredItem === product.id ? <div className='cartIcon-container' onClick={() => this.addToCart(product, product.inStock)}>
                          <img src={Surface} alt="green background surface" className='surface' />
                          <img src={cartIcon2} alt="cart" className='cartIcon' />
                          <img src={cartIcon} alt="cart" className='cartIcon2' />
                          <img src={cartIcon} alt="cart" className='cartIcon3' />
                        </div> : ''}
                        <Link to={{ pathname: `product/${product.id}`, state: { productID: product.id, price: product.prices[this.props.currentCurrency].amount} }}><img src={product.gallery[0]} alt="product" className='productImage' />{!product.inStock ? <div className='stock-bg'></div> : ''}
                        {!product.inStock ? <div className='stock'><h1>Out of stock</h1></div> : ''}</Link>
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
