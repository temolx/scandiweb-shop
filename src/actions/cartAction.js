export const addToCart = (item) => {
    return {
        type: 'ADD',
        payload: item
    }
}

export const setQuantity = (quantity) => { // stores quantity and id of an item with that quantity
    return {
        type: 'SET_QUANITITY',
        payload: quantity
    }
}

export const addQuantity = (quantity) => {
    return {
        type: 'ADD_QUANITITY',
        payload: quantity
    }
}

export const addLocation = (location) => {
    return {
        type: 'ADD_LOCATION',
        payload: location
    }
}

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