const overlayReducer = (state = false, action) => {
    switch(action.type) {
        case 'SHOW_OVERLAY':
            return state = true;
        case 'HIDE_OVERLAY':
            return state = false;
        default:
            return state;
    }
}

export default overlayReducer