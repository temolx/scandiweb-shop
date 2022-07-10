const quantityReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_QUANITITY':
            return action.payload;
        case 'ADD_QUANITITY':
             return [...state, action.payload[state.length]]
        default:
            return state;
    }
}

export default quantityReducer