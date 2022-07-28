import React, { Component } from 'react'
import { withRouter } from './withRouter';
import { connect } from 'react-redux'
import { addToCart } from '../actions/cartAction';
import { showOverlay } from '../actions/overlayAction';
import { hideOverlay } from '../actions/overlayAction';
import { checkAttribute } from '../actions/cartAction';
import { addAttribute } from '../actions/cartAction';
import { request } from 'graphql-request';
import { PRODUCT } from '..';
import { newAttributeSet } from '../actions/cartAction';
import { increment } from '../actions/cartAction';

const mapStateToProps = (props) => {
  return {
    currentCurrency: props.currentCurrency,
    cartItems: props.cartItems,
    checkStatus: props.checkStatus
  }
}

const mapDispatchToProps = () => {
  return {
    addToCart,
    showOverlay,
    hideOverlay,
    checkAttribute,
    addAttribute,
    newAttributeSet,
    increment
  }
}

class ProductPage extends Component {

state = {
  myID: this.props.params.id,
  imageIndex: 0,
  productData: '',
  attributes: [{
    id: 0,
    active: [false, false, false, false]
  }]
}

componentDidMount() {
  request('http://localhost:4000/graphql', PRODUCT, {
    id: this.state.myID
  }).then((data) => {
    // console.log(data.product);
    this.setState(() => {
      return {
        productData: data.product,
        attributes: { attributes: data.product.attributes.map((attribute) => {
          return {
            id: attribute.id,
            active: attribute.items[1].value
          }
        }),
        productID: data.product.id,
        itemIndex: this.props.cartItems.length,
       }
      }
    })
    })
  }


swapImage = (index) => {
  this.setState(() => {
    return {
      imageIndex: index
    }
  })
}

addToCart = (productItem, stockStatus) => {
  const item = {
    ...productItem,
    quantity: 1
  }

  if (stockStatus && !this.props.cartItems.some((el) => el.id === productItem.id)) {
    console.log(item);
    this.props.addToCart(item);

    setTimeout(() => {
      this.props.showOverlay();      
    }, 100)

    setTimeout(() => {
      this.props.hideOverlay();
    }, 1000)

    this.props.addAttribute(this.state.attributes);
  }
  else if (this.props.cartItems.some((el) => el.id === productItem.id)) {
    // same item, different attribute configuration
    if (!this.props.checkStatus.some((el) => el.attributes.every((attribute, index) => attribute.active === this.state.attributes.attributes[index].active))) {
      
      this.props.addToCart(item);

      setTimeout(() => {
        this.props.showOverlay();      
      }, 100)
  
      setTimeout(() => {
        this.props.hideOverlay();
      }, 1000)
  
      this.props.addAttribute(this.state.attributes);
    }

    // same item, same attribute configuration
    else {
      let myIndex = this.props.checkStatus.findIndex((el) => el.attributes.every((attribute, index) => attribute.active === this.state.attributes.attributes[index].active));

      this.props.increment(productItem.id, myIndex);
    }
  }
}



selectAttribute = (currentIndex, attributeID, attributeIndex, attributeValue) => {
  let newElement = {
    id: attributeID,
    active: attributeValue
  }

  this.setState(() => {
    return {
      attributes: { attributes: this.state.attributes.attributes.map((attribute, i) => {
        if (attribute.id !== attributeID) {
          return {
            id: attribute.id,
            active: attribute.active
          }
        }
      else {
        return newElement;
      }
      }), 
      productID: this.state.attributes.productID,
      itemIndex: this.props.cartItems.length,
     }
    }
  })
}

  render() {
    return (
      <div>
          <div className='item-info'>
            <div className="left-item">
              <div className="mini">
                {this.state.productData && this.state.productData.gallery.map((photo, index) => (
                  <img src={photo} alt="product" onClick={() => this.swapImage(index)} key={ photo } />
                ))}
              </div>
              <div className='productImage-info-container'>
                {!this.state.productData.inStock ? <h1 className='stock-product'>Out of stock</h1> : ''}
                <div className={!this.state.productData.inStock ? 'stock-bg-product productImage-info' : 'productImage-info'}><img src={this.state.productData.gallery && this.state.productData.gallery[this.state.imageIndex]} alt="product" className='productImage-info' /></div>
              </div>
            </div>


            <div className="right-item">
              <h1>{ this.state.productData.brand }</h1>
              <h1 className='productName'>{ this.state.productData.name }</h1>

              {this.state.productData && this.state.productData.attributes.map((attribute, attrIndex) => (
              <div className="attribute" key={ attribute.id }>
                <h2 className='attribute-title'>{ attribute.name }:</h2>
                <div className="sizes">
                  {attribute.items.map((attr, i) => (
                    <div className='attribute-items' key={ attr.value }>
                      <input type="radio" className='size-btn' name={ attribute.name } defaultChecked={ i === 1 } onClick={() => this.selectAttribute(i, attribute.id, attrIndex, attr.value)} />
                      
                      {attribute.name !== 'Color' ? <div className='radio-custom'><span>{ attr.value }</span></div> : <div className='radio-custom radio-color' style={{ backgroundColor: `${attr.value}` }}><span className='radio-color-active'></span></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="order-info">
              <h2>Price:</h2>
              <h2 className='price'>{ this.state.productData.prices && (this.state.productData.prices[this.props.currentCurrency].currency.symbol + this.state.productData.prices[this.props.currentCurrency].amount) }</h2>
              <button className='order-btn' onClick={() => this.addToCart(this.state.productData, this.state.productData.inStock)}>{!this.props.cartItems.some((el) => el.id === this.state.productData.id) ? "Add To Cart" : "Added To Cart"}</button>
              
              <p dangerouslySetInnerHTML={{ __html: this.state.productData.description }} />
            </div>
            </div>
          </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(withRouter(ProductPage));