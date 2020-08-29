const getOrder = ({ orderList, selectedOrderId }) => {
	const order = orderList.find(item => item.id === selectedOrderId)
	if (order) {
		return order
	}
	return {}
}

export const Selectors = {
	getOrder,
}
