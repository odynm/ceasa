const getOrder = ({orderList, selectedOrderId}) => {
    const order = orderList.find((item) => item.id === selectedOrderId)
    if (order) {
        return order
    }
    return {}
}

const getOrderCarrying = ({carryingList, selectedCarryingOrderId}) => {
    const order = carryingList.find(
        (item) => item.id === selectedCarryingOrderId,
    )
    if (order) {
        return order
    }
    return {}
}

export const Selectors = {
    getOrder,
    getOrderCarrying,
}
