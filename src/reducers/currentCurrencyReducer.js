const currentCurrencyReducer = (state = 0, action) => {
    switch(action.type) {
        case 'SET_CURRENT_CURRENCY':
            return state = action.payload;
        default:
            return state;
    }
}

export default currentCurrencyReducer