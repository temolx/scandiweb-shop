const cartReducer = (state = [], action) => {
    switch(action.type) {
        case 'ADD': 
            return [...state, action.payload];
        case 'REMOVE':
            return state.filter((el, index) => {
                return index !== action.payload.itemIndex;
            })
        case 'INCREMENT':
            return state.map((el, index) => {
                if (el.id === action.payload.itemID && index === action.payload.itemIndex) {
                    return {...el, quantity: el.quantity + 1 }
                }
                return el;
            })
        case 'DECREMENT':
            return state.map((el, index) => {
                if (el.id === action.payload.itemID && index === action.payload.itemIndex && el.quantity !== 1) {
                    return {...el, quantity: el.quantity - 1 }
                }
                return el;
            })
        default: 
            return state;
    }
}

export default cartReducer