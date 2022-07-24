const attributeReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_ATTRIBUTES':
            return [action.payload];
        case 'ADD_ATTRIBUTE':
            return [...state, action.payload];
        case 'SET_NEW_ATTRIBUTES':
            return action.payload;
        case 'REMOVE_ATTRIBUTE':
            return state.filter((el, index) => {
                return index !== action.payload.itemIndex;
            })
        default:
            return state;
    }
}

export default attributeReducer