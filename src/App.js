import './App.css';
import React, { useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { CATEGORIES } from '.';
import { CURRENCIES } from '.';
import ShopList from './components/ShopList';
import Header from './components/Header';
import Cart from './components/Cart';
import ProductPage from './components/ProductPage';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setCategories } from './actions/categoriesAction';
import { setCurrencies } from './actions/currencyAction';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { setQuantity } from './actions/cartAction';
import { addQuantity } from './actions/cartAction';
import { checkAttribute } from './actions/cartAction';
import { addAttribute } from './actions/cartAction';


function App() {

  const { loading, error, data } = useQuery(CATEGORIES);
  const { loading: currencyLoad, error: currencyErr, data: currencyData } = useQuery(CURRENCIES);

  const dispatch = useDispatch();
  const overlayStatus = useSelector(state => state.overlayStatus)
  const cartItems = useSelector(state => state.cartItems);
  const quantitySet = useSelector(state => state.quantitySet);
  const checkStatus = useSelector(state => state.checkStatus);
  const locationCart = useSelector(state => state.locationCart);
  const currentProductID = useSelector(state => state.currentProductID);

  useEffect(() => {
      if (data) {
        dispatch(setCategories(data.categories));
        console.log("Data dispatched!");
        console.log(data.categories);
      }

      if (currencyData) {
        dispatch(setCurrencies(currencyData.currencies))
        console.log(currencyData.currencies);
      }

      if (quantitySet.length === 0) {
        dispatch(setQuantity(cartItems && cartItems.map((cartItem, index) => {
            return {
              quantity: 1,
              id: cartItem.id
            }
        })));
      }
      else {
        dispatch(addQuantity(cartItems && cartItems.map((cartItem, index) => {
          if (index === cartItems.length - 1) { // latest element
            return {
              quantity: 1,
              id: cartItem.id
            }
          }
        })));
      }

      if (checkStatus.length === 0) {
        dispatch(checkAttribute(cartItems && cartItems.map((cartItem) =>{
          return { attributes: cartItem.attributes.map((attribute) => {
            return {
              id: attribute.id,
              active: attribute.items.map((item) => {
                return false;
              })
            }
          })}
        })));
      }
      else {
        dispatch(addAttribute(cartItems && cartItems.map((cartItem, index) => {
          if (index === cartItems.length - 1) {
            return { attributes: cartItem.attributes.map((attribute) => {
              return {
                id: attribute.id,
                active: attribute.items.map((item) => {
                  return false
                })
              }
            })}
          }
        })));
      }

  }, [loading, currencyLoad, cartItems])

  return (
    <Router>
      <div className="App">
        <Header />
        {overlayStatus && locationCart !== '/cart' ? <div className="overlay"></div> : ''}

        <Routes>
          <Route path="/" element={<ShopList />} />
          <Route path="/cart" element={<Cart />} />
          <Route exact path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
