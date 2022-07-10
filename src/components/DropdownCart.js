import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setQuantity } from '../actions/cartAction'
import { checkAttribute } from '../actions/cartAction'
import { Link } from 'react-router-dom'

const mapStateToProps = (props) => {
    return {
      cartItems: props.cartItems,
      currentCurrency: props.currentCurrency,
      quantitySet: props.quantitySet,
      checkStatus: props.checkStatus,
      locationCart: props.locationCart
    }
  }

  const mapDispatchToProps = () => {
    return {
      setQuantity,
      checkAttribute
    }
  }

class DropdownCart extends Component {

    state = {
        itemCount: this.props.cartItems.map((cartItem, index) => {
          return {
            id: cartItem.id,
            quantity: this.props.quantitySet[index].quantity,
            price: cartItem.prices[this.props.currentCurrency].amount
          }
        }),
        total: 0
    }

    componentDidMount() {
      this.setState(() => {
        return {
          total: this.state.itemCount.reduce((prev, current, index) => prev + current.price * this.props.quantitySet[index].quantity, 0)
        }
      })
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
              total: this.state.itemCount.reduce((prev, current, index) => prev + current.price * this.props.quantitySet[index].quantity, 0)
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
              total: this.state.itemCount.reduce((prev, current, index) => prev + current.price * this.props.quantitySet[index].quantity, 0)
            }
          })
          this.props.setQuantity(this.state.itemCount);
        })
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
      }

  render() {
    return (
      <div className='dropdown-cart'>
        <h4 className='dropdownCart-title'><span>My Bag,</span> 3 items</h4>


        {this.props.cartItems && this.props.cartItems.map((cartItem, index) => (
            <div className="dropdown-cart-list-container">
            <div className="dropdown-cart-list">
                <h4>{ cartItem.brand }</h4>
                <h4>{ cartItem.name }</h4>
                <h4>{ cartItem.prices[this.props.currentCurrency].currency.symbol + cartItem.prices[this.props.currentCurrency].amount }</h4>

                {cartItem.attributes.map((attribute, attrIndex) => (
                        <div className="dropdownCart-attribute-list">
                        <h2 className='dropdown-attribute-title'>{ attribute.name }:</h2>
                        <div className="dropdown-sizes">
                        {attribute.items.map((attr, i) => (
                         <div className='dropdown-attribute-items'>
                            <input type="radio" className='dropdownCart-input' name={ attribute.name + cartItem.id } onClick={() => this.selectAttribute(i, cartItem.id, attribute.name)} defaultChecked={ this.props.checkStatus[index].attributes[attrIndex].active[i] !== false ? this.props.checkStatus[index].attributes[attrIndex].active[i] : i === 1 } />

                            {attribute.name !== 'Color' ? <div className='dropCart-radio-custom'><span>{ attr.displayValue === '40' ? 'XS' : (attr.displayValue === '41' ? 'S' : (attr.displayValue === '42' ? 'M' : (attr.displayValue === '43' ? 'L' : attr.displayValue)) )}</span></div> : <div className='dropCart-radio-custom dropCart-radio-color' style={{ backgroundColor: `${attr.value}` }}><span className='radio-color-active'></span></div>}
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="dropdownCart-img-container">
                <div className="quantity-btn">
                    <button onClick={() => this.handleIncrement(cartItem.id)}>+</button>
                    <h1 className='quantity'>{ this.props.quantitySet[index].quantity }</h1>
                    <button onClick={() => this.handleDecrement(cartItem.id)}>-</button>
                </div>

                <img src={cartItem.gallery[0]} alt="product image" className='dropdownCart-img' />
            </div>

            </div>
        ))}

        <div className="dropdownCart-summary">
            <h4>Total: <span>{ this.props.cartItems[0].prices[this.props.currentCurrency].currency.symbol + Math.round((this.state.total + this.state.total * 0.21) * 100) / 100 }</span></h4>

            <div className="summary-btns">
                <Link to='/cart'>View bag</Link>
                <Link to='/cart'>Check out</Link>
            </div>
        </div>

        </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(DropdownCart)
