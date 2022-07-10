import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './reducers/categoriesReducer';
import cartReducer from './reducers/cartReducer';
import categoryReducer from './reducers/categoryReducer';
import currencyReducer from './reducers/currencyReducer';
import currentCurrencyReducer from './reducers/currentCurrencyReducer'
import overlayReducer from './reducers/overlayReducer';
import quantityReducer from './reducers/quantityReducer';
import attributeReducer from './reducers/attributeReducer';
import locationReducer from './reducers/locationReducer';



export const CURRENCIES = gql`
 query GetCurrencies {
  currencies {
    label
    symbol
  }
}
`;

// needs "id" (input probs)
export const PRODUCT = gql`
 query GetProduct($id: String!) {
  product(id: $id) {
    id
    name
    inStock
    gallery
    description
    category
    attributes {
      id
      name
      type
      items {
        displayValue
        value
      }
    }
    prices {
      currency {
        label
        symbol
      }
    }
    brand
  }
}
`;

export const CATEGORIES = gql`
  query GetCategories {
    categories {
      name
      products {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              displayValue
              value
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
      }
    }
  }
`;

// ARGUMENT: "CategoryInput"
export const CATEGORY = gql`
 query GetCategory {
  category {
    name
    products {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
  }
  }
}
`;

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache()
});


const store = configureStore({
  reducer: {
    storeCategories: categoriesReducer,
    cartItems: cartReducer,
    currentCategory: categoryReducer,
    currencyItems: currencyReducer,
    currentCurrency: currentCurrencyReducer,
    overlayStatus: overlayReducer,
    quantitySet: quantityReducer,
    checkStatus: attributeReducer,
    locationCart: locationReducer,
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
  <Provider store={store}>
    <App />
  </Provider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
