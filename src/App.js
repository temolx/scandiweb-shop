import './App.css';
import React, { Component } from 'react'
import { CATEGORIES } from '.';
import { CURRENCIES } from '.';
import ShopList from './components/ShopList';
import Header from './components/Header';
import Cart from './components/Cart';
import ProductPage from './components/ProductPage';
import { setCategories } from './actions/categoriesAction';
import { setCurrencies } from './actions/currencyAction';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import { request } from 'graphql-request';

const mapStateToProps = (props) => {
    return {
      overlayStatus: props.overlayStatus,
      locationCart: props.locationCart
    }
  }

const mapDispatchToProps = () => {
    return {
        setCategories,
        setCurrencies
    }
  }

class App extends Component {

  componentDidMount() {
        request('http://localhost:4000/graphql', CATEGORIES).then((data) => {
            this.props.setCategories(data.categories);
            console.log(data.categories);
          })

        request('http://localhost:4000/graphql', CURRENCIES).then((data) => {
            this.props.setCurrencies(data.currencies);
            // console.log(data.currencies);
          })
    }


  render() {
    return (
        <Router>
        <div className="App">
          <Header />
          {this.props.overlayStatus && this.props.locationCart !== '/cart' ? <div className="overlay"></div> : ''}
  
          <Routes>
            <Route path="/" element={<ShopList />} />
            <Route path="/cart" element={<Cart />} />
            <Route exact path="/product/:id" element={<ProductPage />} />
          </Routes>
        </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(App)
