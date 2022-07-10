export const categoryAction = (index, name) => {
    return {
        type: 'SET_CATEGORY',
        payload: {
            index, name
        }
    }
}