import './App.css';
import React, { Component } from 'react'
import ShopList from './components/ShopList';
import Header from './components/Header';
import Cart from './components/Cart';
import ProductPage from './components/ProductPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

const mapStateToProps = (props) => {
    return {
      overlayStatus: props.overlayStatus,
      locationCart: props.locationCart
    }
  }

class App extends Component {

  componentDidMount() {
    console.log("*NOTE: In PDP, only 1 product is fetched and in Shop List, only 1 category products are fetched. All 3 categories are fetched for the header navigation.");
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

export default connect(mapStateToProps)(App)
