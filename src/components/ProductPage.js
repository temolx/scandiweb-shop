import React, { Component } from 'react'
import { withRouter } from './withRouter';
import { connect } from 'react-redux'
import { addToCart } from '../actions/cartAction';
import { showOverlay } from '../actions/overlayAction';
import { hideOverlay } from '../actions/overlayAction';
import { checkAttribute } from '../actions/cartAction';
import { addAttribute } from '../actions/cartAction';

const mapStateToProps = (props) => {
  return {
    categories: props.storeCategories,
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
    addAttribute
  }
}

class ProductPage extends Component {

state = {
  myID: this.props.params.id,
  imageIndex: 0,
  attributes: []
}



swapImage = (index) => {
  this.setState(() => {
    return {
      imageIndex: index
    }
  })
}

addToCart = (productItem, stockStatus) => {
  if (stockStatus && !this.props.cartItems.some((el) => el.id === productItem.id)) {
    this.props.addToCart(productItem);

    setTimeout(() => {
      this.props.showOverlay();

      this.props.checkAttribute(this.props.cartItems.map((cartItem, i) => {
        return { attributes: cartItem.attributes.map((attribute, attrIndex) => {
          return {
            id: attribute.id,
            active: attribute.items.map((item, index) => {
             if (this.state.attributes.some((el) => el.currentIndex === index && el.attributeName === attribute.name) && cartItem.id === productItem.id) {
              return true;
             }
             if (!this.state.attributes.some((el) => el.attributeName === attribute.name) && cartItem.id === productItem.id) {
              return false;
             }
             else if (cartItem.id !== productItem.id) {
              return this.props.checkStatus[i].attributes[attrIndex].active[index];
             }
            })
          }
        })}
      }))

      console.log(this.props.checkStatus);
    }, 100)

    setTimeout(() => {
      this.props.hideOverlay();
    }, 1000)
  }
}

selectAttribute = (currentIndex, attributeName, productID) => {
  if (!this.state.attributes.some((el) => el.attributeName === attributeName)) { // add into the attributes state
    this.setState(() => {
      return {
        attributes: [...this.state.attributes, {
          currentIndex: currentIndex,
          attributeName: attributeName,
          productID: productID
        }]
      }
    })
  }
  else {
    // modify the attributes state
    let index = this.state.attributes.findIndex((x) => x.productID === productID);
    let newElement = {
      currentIndex: currentIndex,
      attributeName: attributeName,
      productID: productID
    }

    this.setState(() => {
      return {
        attributes: this.state.attributes.map((attribute) => {
          return attribute.attributeName === attributeName ? newElement : attribute
        })
      }
    })
  }

  console.log(this.state.attributes)
}

  render() {
    

    return (
      <div>
        {this.props.categories[0] && this.props.categories[0].products.filter((el) => {
          return el.id === this.props.params.id
        }).map((product) => (
          <div className='item-info'>
            <div className="left-item">
              <div className="mini">
                {product.gallery.map((photo, index) => (
                  <img src={photo} alt="product image" onClick={() => this.swapImage(index)} />
                ))}
              </div>
              <div className='productImage-info-container'>
                <img src={product.gallery[this.state.imageIndex]} alt="product image" className={product.id !== 'jacket-canada-goosee' ? 'productImage-info' : 'productImage-info productImage-coat'} />
              </div>
            </div>


            <div className="right-item">
              <h1>{ product.brand }</h1>
              <h1 className='productName'>{ product.name }</h1>

              {product.attributes.map((attribute, attrIndex) => (
              <div className="attribute">
                <h2 className='attribute-title'>{ attribute.name }:</h2>
                <div className="sizes">
                  {attribute.items.map((attr, i) => (
                    <div className='attribute-items'>
                      <input type="radio" className='size-btn' name={ attribute.name } defaultChecked={ i === 1 } onClick={() => this.selectAttribute(i, attribute.name, product.id)} />
                      
                      {attribute.name !== 'Color' ? <div className='radio-custom'><span>{ attr.displayValue === '40' ? 'XS' : (attr.displayValue === '41' ? 'S' : (attr.displayValue === '42' ? 'M' : (attr.displayValue === '43' ? 'L' : attr.displayValue)) ) }</span></div> : <div className='radio-custom radio-color' style={{ backgroundColor: `${attr.value}` }}><span className='radio-color-active'></span></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="order-info">
              <h2>Price:</h2>
              <h2 className='price'>{ product.prices[this.props.currentCurrency].currency.symbol + product.prices[this.props.currentCurrency].amount }</h2>
              <button className='order-btn' onClick={() => this.addToCart(product, product.inStock)}>{!this.props.cartItems.some((el) => el.id === product.id) ? "Add To Cart" : "Added To Cart"}</button>
              <p>{ product.description.replace(/<[^>]+>/g, '')}</p>
            </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(withRouter(ProductPage));