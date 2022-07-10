const attributeReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_ATTRIBUTES':
            return action.payload;
        case 'ADD_ATTRIBUTE':
            return [...state, action.payload[state.length]]
        default:
            return state;
    }
}

export default attributeReducer