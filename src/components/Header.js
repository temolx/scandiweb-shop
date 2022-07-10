import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.svg'
import dollar from '../images/dollar.svg'
import downArrow from '../images/downArrow.svg'
import cartIcon from '../images/cartIconBlack/Vector-2.svg'
import cartIcon2 from '../images/cartIconBlack/Vector.svg'
import { Link } from 'react-router-dom'
import { categoryAction } from '../actions/categoryAction'
import { currentCurrencyAction } from '../actions/currentCurrencyAction'
import DropdownCart from './DropdownCart'
import { showOverlay } from '../actions/overlayAction'
import { hideOverlay } from '../actions/overlayAction'
import logoElement1 from '../images/logoElement1.svg'
import logoElement2 from '../images/logoElement2.svg'
import logobg from '../images/logo-bg.svg'

const mapStateToProps = (props) => {
  return {
    categories: props.storeCategories,
    currencies: props.currencyItems,
    currentCurrency: props.currentCurrency,
    overlayStatus: props.overlayStatus,
    locationCart: props.locationCart,
    cartItems: props.cartItems,
    category: props.currentCategory
  }
}

const mapDispatchToProps = () => {
  return {
    categoryAction,
    currentCurrencyAction,
    showOverlay,
    hideOverlay
  }
}

class Header extends Component {

  state = {
    currenciesVisible: false,
    cartVisible: false,
    currencySymbol: "$",
  }

  componentDidUpdate() {
    console.log('locationCart? : ' + this.props.locationCart);
  }

  handleCategory = (cagegoryIndex, name) => {
    // dispatching...
    this.props.categoryAction(cagegoryIndex, name);
  }

  showCurrencies = () => {
    this.setState(() => {
      return {
        currenciesVisible: true
      }
    })
  }

  hideCurrencies = () => {
    this.setState(() => {
      return {
        currenciesVisible: false
      }
    })
  }

  setCurrency = (currencyIndex, symbol) => {
    this.props.currentCurrencyAction(currencyIndex);

    this.setState(() => {
      return {
        currencySymbol: symbol
      }
    })
  }

  showCart = () => {
    if (this.props.cartItems.length !== 0) {
      this.setState(() => {
        return {
          cartVisible: true
        }
      })

      this.props.showOverlay();
    }
  }

  hideCart = () => {
    this.setState(() => {
      return {
        cartVisible: false
      }
    })

    this.props.hideOverlay();
  }

  render() {
    return (
      <nav>
        <ul>
          {this.props.categories.map((category, index) => (
            <li key={category.id} onClick={() => this.handleCategory(index, category.name)} className={this.props.category.name === category.name ? 'categoryTitle activeCategory' : 'categoryTitle'} >{ category.name }</li>
          ))}
          <Link to="/"><li className='logo'>
            <img src={logo} alt="logo" />
            <img src={logobg} alt="logo background" className='logo-bg' />

            <div className="logo-elements">
              <img src={logoElement1} alt="logo element 1" className='logoEl1' />
              <img src={logoElement2} alt="logo element 2" className='logoEl2' />
            </div>
          </li></Link>
          <div className="navIcons">
            <li className='currency-container' onMouseEnter={this.showCurrencies} onMouseLeave={this.hideCurrencies}>
              <div className="currency-icons">
                <h3 className='current-currency'>{ this.state.currencySymbol }</h3>
                <img src={downArrow} alt="dollar sign down arrow icon" className={!this.state.currenciesVisible ? 'dollar-arrow' : 'dollar-arrow dollar-arrow-active'} />
              </div>

              {this.state.currenciesVisible ? <ul className="currency-options">
                {this.props.currencies.map((currency, currencyIndex) => (
                  <li onClick={() => this.setCurrency(currencyIndex, currency.symbol)}>{ currency.symbol + " " + currency.label}</li>
                ))}
              </ul> : ''}
            </li>

          <div className="navbar-cart" onMouseEnter={this.showCart} onMouseLeave={this.hideCart}>
            <Link to={this.props.cartItems.length !== 0 ? '/cart': '#'}><li className='cart-icons'>
              <img src={cartIcon2}  alt="cart icon" />
              <img src={cartIcon} alt="cart icon" />
              <img src={cartIcon} alt="cart icon" />
              {this.props.cartItems.length !== 0 ? <div className='cart-quantity'>{ this.props.cartItems.length }</div> : ''}
            </li></Link>

            {this.props.locationCart !== '/cart' ?
            <div className="dropdown-container">
              {this.state.cartVisible || this.props.overlayStatus ? <DropdownCart /> : ''}
            </div> : ''}
          </div>

          </div>
        </ul>
      </nav>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(Header)
