export const addToCart = (item) => {
    return {
        type: 'ADD',
        payload: item
    }
}

export const removeFromCart = (itemID, itemIndex) => {
    return {
        type: 'REMOVE',
        payload: {
            itemID: itemID,
            itemIndex: itemIndex
        }
    }
}

export const increment = (itemID, itemIndex) => {
    return {
        type: 'INCREMENT',
        payload: {
            itemID: itemID,
            itemIndex: itemIndex
        }
    }
}

export const decrement = (itemID, itemIndex) => {
    return {
        type: 'DECREMENT',
        payload: {
            itemID: itemID,
            itemIndex: itemIndex
        }
    }
}

// --------------------------------

export const addLocation = (location) => {
    return {
        type: 'ADD_LOCATION',
        payload: location
    }
}


// --------------------------------


export const checkAttribute = (attributeData) => {
    return {
        type: 'SET_ATTRIBUTES',
        payload: attributeData
    }
}

export const addAttribute = (attributeData) => {
    return {
        type: 'ADD_ATTRIBUTE',
        payload: attributeData
    }
}

export const newAttributeSet = (attributeData) => {
    return {
        type: 'SET_NEW_ATTRIBUTES',
        payload: attributeData
    }
}

export const removeAttribute = (itemID, itemIndex) => {
    return {
        type: 'REMOVE_ATTRIBUTE',
        payload: {
            itemID: itemID,
            itemIndex: itemIndex
        }
    }
}