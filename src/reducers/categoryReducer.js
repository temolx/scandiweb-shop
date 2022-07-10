const categoryReducer = (state = {index: 0, name: 'all'}, action) => {
    switch(action.type) {
        case 'SET_CATEGORY':
            return state = {
                index: action.payload.index,
                name: action.payload.name
            };
        default:
            return state;
    }
}

export default categoryReducer