import React, { Component } from 'react'
import { connect } from 'react-redux'
import cartArrow from '../images/cart-arrow.svg'
import { checkAttribute } from '../actions/cartAction'
import { setQuantity } from '../actions/cartAction'
import { addLocation } from '../actions/cartAction'

const mapStateToProps = (props) => {
  return {
    cartItems: props.cartItems,
    currentCurrency: props.currentCurrency,
    checkStatus: props.checkStatus,
    quantitySet: props.quantitySet
  }
}

const mapDispatchToProps = () => {
  return {
    checkAttribute,
    setQuantity,
    addLocation
  }
}

class Cart extends Component {

  state = {
    update: false,
    itemCount: this.props.cartItems.map((cartItem, index) => {
      return {
        id: cartItem.id,
        quantity: this.props.quantitySet[index].quantity,
        price: cartItem.prices
      }
    }),
    activeStatus: this.props.cartItems.map((cartItem) => {
      return { attributes: cartItem.attributes.map((attribute) => {
        return {
          id: attribute.id,
          active: attribute.items.map((item) => {
            return false;
          })
        }
      })}
    }),

    imageIndex: this.props.cartItems.map((el) => {
      return 0;
    }),
    total: 0
  }


componentDidMount() {
  console.log("Data obtained in cart!")
  console.log(this.props.cartItems)
 
  this.props.addLocation(window.location.pathname);

  this.setState(() => {
    return {
      total: this.state.itemCount.reduce((prev, current, index) => prev + current.price[this.props.currentCurrency].amount * this.props.quantitySet[index].quantity, 0)
    }
  })
}

componentWillUnmount() {
  this.props.addLocation('');
}

componentDidUpdate(previousProps, previousState) {
  if (previousProps.currentCurrency !== this.props.currentCurrency) {
    this.setState(() => {
      return {
        total: this.state.itemCount.reduce((prev, current, index) => prev + current.price[this.props.currentCurrency].amount * this.props.quantitySet[index].quantity, 0)
      }
    })
  }
}


selectAttribute = (currentIndex, itemID, attributeName) => {

  this.props.checkAttribute(this.props.cartItems.map((cartItem, i) => {
    return { attributes: cartItem.attributes.map((attribute, attrIndex) => {
      return {
        id: attribute.id,
        active: attribute.items.map((item, index) => {
         if (index === currentIndex && cartItem.id === itemID && attribute.name === attributeName) {
          return true;
         }
         else if (cartItem.id !== itemID && attribute.name === attributeName || attribute.name !== attributeName) {
          return this.props.checkStatus[i].attributes[attrIndex].active[index]
         }
        })
      }
    })}
  }))

  console.log(this.props.checkStatus);
}

handleIncrement = (id) => {
  this.setState(() => {
    return {
      itemCount: this.state.itemCount.map((item) => {
      if (id === item.id) {
        return {
          id: item.id,
          quantity: item.quantity + 1,
          price: item.price
        }
      }
      else {
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }
      }   
      })
    }
  }, () => {
    this.setState(() => {
      return {
        total: this.state.itemCount.reduce((prev, current, index) => prev + current.price[this.props.currentCurrency].amount * this.props.quantitySet[index].quantity, 0)
      }
    })
    this.props.setQuantity(this.state.itemCount);
  })
}

handleDecrement = (id) => {
  this.setState(() => {
    return {
      itemCount: this.state.itemCount.map((item) => {
      if (id === item.id && item.quantity !== 1) {
        return {
          id: item.id,
          quantity: item.quantity - 1,
          price: item.price
        }
      }
      else {
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }
      }   
      })
    }
  }, () => {
    this.setState(() => {
      return {
        total: this.state.itemCount.reduce((prev, current, index) => prev + current.price[this.props.currentCurrency].amount * this.props.quantitySet[index].quantity, 0)
      }
    })
    this.props.setQuantity(this.state.itemCount);
  })
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
          <div className="cartList-container">
          <div className='cart-list' key={cartItem.id}>
            <div className="left">
            <h1 className='brand'>{ cartItem.brand }</h1>
            <h1 className='name'>{ cartItem.name }</h1>
            <h1 className='price'>{ cartItem.prices[this.props.currentCurrency].currency.symbol + cartItem.prices[this.props.currentCurrency].amount }</h1>

            {cartItem.attributes.map((attribute, attrIndex) => (
              <div className="attribute">
                <h2 className='attribute-title'>{ attribute.name }:</h2>
                <div className="sizes">
                  {attribute.items.map((attr, i) => (
                    <div className='attribute-items'>
                      <input type="radio" className='size-btn' name={ attribute.name + cartItem.id } onClick={() => this.selectAttribute(i, cartItem.id, attribute.name)} defaultChecked={ this.props.checkStatus[index].attributes[attrIndex].active[i] !== false ? this.props.checkStatus[index].attributes[attrIndex].active[i] : i === 1 } />

                      {attribute.name !== 'Color' ? <div className='radio-custom'><span>{ attr.displayValue === '40' ? 'XS' : (attr.displayValue === '41' ? 'S' : (attr.displayValue === '42' ? 'M' : (attr.displayValue === '43' ? 'L' : attr.displayValue)) )}</span></div> : <div className='radio-custom radio-color' style={{ backgroundColor: `${attr.value}` }}></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="right">
            <div className="quantity-btn">
              <button onClick={() => this.handleIncrement(cartItem.id)}>+</button>
              <h1 className='quantity'>{ this.props.quantitySet[index].quantity }</h1>

              <button onClick={() => this.handleDecrement(cartItem.id)}>-</button>
            </div>

            <div className="cart-images">
              <div className="arrows">
                <div className='arrow-container leftArrow' onClick={() => this.handlePrev(index)}><img src={cartArrow} alt="arrow right"/></div>
                <div className='arrow-container rightArrow' onClick={() => this.handleNext(index)}><img src={cartArrow} alt="arrow right" /></div>
              </div>

              <img src={cartItem.gallery[this.state.imageIndex[index]]} alt="product image" className='cartItem-img'/>
            </div>
          </div>
          
          </div>
          <hr />
          </div>
        ))}

        <div className="checkout">
          <div className="checkout-info">
            <h2>Tax 21%: </h2>
            <h2><span>{ this.props.cartItems[0].prices[this.props.currentCurrency].currency.symbol + Math.round(this.state.total * 0.21 * 100) / 100 }</span></h2>
          </div>

          <div className="checkout-info">
            <h2>Quantity: </h2>
            <h2><span>{ this.props.cartItems.length }</span></h2>
          </div>

          <div className="checkout-info">
            <h2>Total: </h2>
            <h2><span>{ this.props.cartItems[0].prices[this.props.currentCurrency].currency.symbol + Math.round((this.state.total + this.state.total * 0.21) * 100) / 100 }</span></h2>
          </div>

          <button className='order-btn'>Order</button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(Cart)
