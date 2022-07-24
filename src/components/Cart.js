import React, { Component } from 'react'
import { connect } from 'react-redux'
import cartArrow from '../images/cart-arrow.svg'
import { addLocation } from '../actions/cartAction'
import { newAttributeSet } from '../actions/cartAction'
import { increment } from '../actions/cartAction';
import { decrement } from '../actions/cartAction'

const mapStateToProps = (props) => {
  return {
    cartItems: props.cartItems,
    currentCurrency: props.currentCurrency,
    checkStatus: props.checkStatus
  }
}

const mapDispatchToProps = () => {
  return {
    newAttributeSet,
    addLocation,
    increment,
    decrement
  }
}

class Cart extends Component {

  state = {
    imageIndex: this.props.cartItems.map((el) => {
      return 0;
    })
  }


componentDidMount() {
  this.props.addLocation(window.location.pathname);
}

componentWillUnmount() {
  this.props.addLocation('');
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

handleIncrement = (id, cartIndex) => {
  let myIndex = this.props.checkStatus.findIndex((el, index) => index === cartIndex);
  this.props.increment(id, myIndex)
}

handleDecrement = (id, cartIndex) => {
  let myIndex = this.props.checkStatus.findIndex((el, index) => index === cartIndex);
  this.props.decrement(id, myIndex)
}

handleNext = (i) => {
  this.setState(() => {
    return {
      imageIndex: this.props.cartItems.map((el, index) => {
        if (index === i && this.state.imageIndex[index] !== el.gallery.length - 1) {
          return this.state.imageIndex[index] + 1;
        }
        else return this.state.imageIndex[index]
      })
    }
  })
}

handlePrev = (i) => {
  this.setState(() => {
    return {
      imageIndex: this.props.cartItems.map((el, index) => {
        if (index === i && this.state.imageIndex[index] !== 0) {
          return this.state.imageIndex[index] - 1;
        }
        else return this.state.imageIndex[index]
      })
    }
  })
}

   render() {
    return (
      <div className='cart'>
        <h1 className='cart-title'>Cart</h1>
        <hr />

        {this.props.cartItems && this.props.cartItems.map((cartItem, index) => (
          <div className="cartList-container" key={ cartItem.id }>
          <div className='cart-list' key={cartItem.id}>
            <div className="left">
            <h1 className='brand'>{ cartItem.brand }</h1>
            <h1 className='name'>{ cartItem.name }</h1>
            <h1 className='price'>{ cartItem.prices[this.props.currentCurrency].currency.symbol + cartItem.prices[this.props.currentCurrency].amount }</h1>

            {cartItem.attributes.map((attribute, attrIndex) => (
              <div className="attribute" key={ attribute.id }>
                <h2 className='attribute-title'>{ attribute.name }:</h2>
                <div className="sizes">
                  {attribute.items.map((attr, i) => (
                    <div className='attribute-items' key={ attr.value }>
                      <input type="radio" className='size-btn' name={ attribute.name + cartItem.id + index } onClick={() => this.selectAttribute(cartItem.id, attribute.id, index, attr.value)} defaultChecked={ attr.value === this.props.checkStatus[index].attributes[attrIndex].active ? this.props.checkStatus[index].attributes[attrIndex].active : '' } />

                      {attribute.name !== 'Color' ? <div className='radio-custom'><span>{ attr.value }</span></div> : <div className='radio-custom radio-color' style={{ backgroundColor: `${attr.value}` }}></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="right">
            <div className="quantity-btn">
              <button onClick={() => this.handleIncrement(cartItem.id, index)}>+</button>
              <h1 className='quantity'>{ cartItem.quantity }</h1>

              <button onClick={() => this.handleDecrement(cartItem.id, index)}>-</button>
            </div>

            <div className="cart-images">
              {cartItem.gallery.length > 1 ? <div className="arrows">
                <div className='arrow-container leftArrow' onClick={() => this.handlePrev(index)}><img src={cartArrow} alt="arrow right"/></div>
                <div className='arrow-container rightArrow' onClick={() => this.handleNext(index)}><img src={cartArrow} alt="arrow right" /></div>
              </div> : ''}

              <img src={cartItem.gallery[this.state.imageIndex[index]]} alt="product" className='cartItem-img'/>
            </div>
          </div>
          
          </div>
          <hr />
          </div>
        ))}

        <div className="checkout">
          <div className="checkout-info">
            <h2>Tax 21%: </h2>
            <h2><span>{ this.props.cartItems[0].prices[this.props.currentCurrency].currency.symbol + Math.round(this.props.cartItems.reduce((prev, current) => prev + current.prices[this.props.currentCurrency].amount * current.quantity, 0) * 0.21 * 100) / 100 }</span></h2>
          </div>

          <div className="checkout-info">
            <h2>Quantity: </h2>

            <h2><span>{ this.props.cartItems.reduce((prev, current) => prev + current.quantity, 0) }</span></h2>



          </div>

          <div className="checkout-info">
            <h2>Total: </h2>
            <h2><span>{ this.props.cartItems[0].prices[this.props.currentCurrency].currency.symbol + Math.round((this.props.cartItems.reduce((prev, current) => prev + current.prices[this.props.currentCurrency].amount * current.quantity, 0) + this.props.cartItems.reduce((prev, current) => prev + current.prices[this.props.currentCurrency].amount * current.quantity, 0) * 0.21) * 100) / 100 }</span></h2>
          </div>

          <button className='order-btn'>Order</button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(Cart)
