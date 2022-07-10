const currencyReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_CURRENCIES':
            return state = action.payload;
        default:
            return state;
    }
}

export default currencyReducer