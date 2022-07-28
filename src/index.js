import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './reducers/categoriesReducer';
import cartReducer from './reducers/cartReducer';
import categoryReducer from './reducers/categoryReducer';
import currencyReducer from './reducers/currencyReducer';
import currentCurrencyReducer from './reducers/currentCurrencyReducer'
import overlayReducer from './reducers/overlayReducer';
import attributeReducer from './reducers/attributeReducer';
import locationReducer from './reducers/locationReducer';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from 'redux-persist'



export const CURRENCIES = gql`
 query GetCurrencies {
  currencies {
    label
    symbol
  }
}
`;


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
      amount
    }
    brand
  }
}
`;

export const CATEGORIES = gql`
  query GetCategories {
    categories {
      name

    }
  }
`;

export const CATEGORYINPUT = gql`
 query GetCategoryInput {
  categoryinput {
    title
  }
}
`;

// INPUT: "CategoryInput"
export const CATEGORY = gql`
 query GetCategory($input: CategoryInput) {
  category(input: $input) {
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




const rootReducer = combineReducers({
    currentCategory: categoryReducer,
    storeCategories: categoriesReducer,
    cartItems: cartReducer,
    currencyItems: currencyReducer,
    currentCurrency: currentCurrencyReducer,
    overlayStatus: overlayReducer,
    checkStatus: attributeReducer,
    locationCart: locationReducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['currentCategory', 'currentCurrency']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

let persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
