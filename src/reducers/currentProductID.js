const currentProductID = (state = 'ps-5', action) => {
    switch(action.type) {
        case 'SET_PRODUCT_ID':
            return state = action.payload;
        default:
            return state;
    }
}

export default currentProductID