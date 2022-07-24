import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { newAttributeSet } from '../actions/cartAction'
import { increment } from '../actions/cartAction';
import { decrement } from '../actions/cartAction'
import { removeFromCart } from '../actions/cartAction'
import { removeAttribute } from '../actions/cartAction'
import { hideOverlay } from '../actions/overlayAction'

const mapStateToProps = (props) => {
    return {
      cartItems: props.cartItems,
      currentCurrency: props.currentCurrency,
      checkStatus: props.checkStatus,
      locationCart: props.locationCart
    }
  }

  const mapDispatchToProps = () => {
    return {
      newAttributeSet,
      increment,
      decrement,
      removeFromCart,
      removeAttribute,
      hideOverlay
    }
  }

class DropdownCart extends Component {

    handleIncrement = (id, cartIndex) => {
      let myIndex = this.props.checkStatus.findIndex((el, index) => index === cartIndex);
      this.props.increment(id, myIndex)
    }
      
    // *NOTE: Item can be removed from cart review when quantity is 1 and its decremented.
    handleDecrement = (id, cartIndex) => {
        if (this.props.cartItems[cartIndex].quantity === 1) {
            this.props.removeFromCart(id, cartIndex);
            this.props.removeAttribute(id, cartIndex);
            this.props.hideOverlay();
        }

        let myIndex = this.props.checkStatus.findIndex((el, index) => index === cartIndex);
        this.props.decrement(id, myIndex)
    }


      selectAttribute = (itemID, attributeID, itemIndex, newAttributeValue) => {
        this.props.newAttributeSet(this.props.cartItems.map((cartItem, index) => {
          return { attributes: cartItem.attributes.map((attribute, i) => {
            return {
              id: attribute.id,
              active: index === itemIndex && attribute.id === attributeID ? newAttributeValue : this.props.checkStatus[index].attributes[i].active
            }
          }),
          productID: itemID,
          itemIndex: index
        }
        }));
      }

  render() {
    return (
      <div className='dropdown-cart'>
        <h4 className='dropdownCart-title'><span>My Bag,</span> { this.props.cartItems.reduce((prev, current) => prev + current.quantity, 0) } items</h4>


        {this.props.cartItems && this.props.cartItems.map((cartItem, index) => (
            <div className="dropdown-cart-list-container" key={ cartItem.id + index }>
            <div className="dropdown-cart-list">
                <h4>{ cartItem.brand }</h4>
                <h4>{ cartItem.name }</h4>
                <h4>{ cartItem.prices[this.props.currentCurrency].currency.symbol + cartItem.prices[this.props.currentCurrency].amount }</h4>

                {cartItem.attributes.map((attribute, attrIndex) => (
                        <div className="dropdownCart-attribute-list" key={ attribute.id }>
                        <h2 className='dropdown-attribute-title'>{ attribute.name }:</h2>
                        <div className="dropdown-sizes">
                        {attribute.items.map((attr, i) => (
                         <div className='dropdown-attribute-items' key={ attr.value }>
                            <input type="radio" className='dropdownCart-input' name={ attribute.name + cartItem.id + index } onClick={() => this.selectAttribute(cartItem.id, attribute.id, index, attr.value )} defaultChecked={ attr.value === this.props.checkStatus[index].attributes[attrIndex].active ? this.props.checkStatus[index].attributes[attrIndex].active : '' } />

                            {attribute.name !== 'Color' ? <div className='dropCart-radio-custom'><span>{ attr.value }</span></div> : <div className='dropCart-radio-custom dropCart-radio-color' style={{ backgroundColor: `${attr.value}` }}><span className='radio-color-active'></span></div>}
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="dropdownCart-img-container">
                <div className="quantity-btn">
                    <button onClick={() => this.handleIncrement(cartItem.id, index)}>+</button>
                    <h1 className='quantity'>{ cartItem.quantity }</h1>
                    <button onClick={() => this.handleDecrement(cartItem.id, index)}>-</button>
                </div>

                <img src={cartItem.gallery[0]} alt="product" className='dropdownCart-img' />
            </div>

            </div>
        ))}

        <div className="dropdownCart-summary">
            <h4>Total: <span>{ this.props.cartItems[0].prices[this.props.currentCurrency].currency.symbol + Math.round((this.props.cartItems.reduce((prev, current) => prev + current.prices[this.props.currentCurrency].amount * current.quantity, 0) + this.props.cartItems.reduce((prev, current) => prev + current.prices[this.props.currentCurrency].amount * current.quantity, 0) * 0.21) * 100) / 100 }</span></h4>

            <div className="summary-btns">
                <Link to='/cart'>View bag</Link>
                <Link to='/cart'>Check out</Link>
            </div>
        </div>

        </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(DropdownCart)
