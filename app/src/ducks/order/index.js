import HttpService from 'src/services/httpService'

const prefix = 'order/'
const Types = {
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
}

const setOrderItems = orderItems => ({
	payload: { orderItems },
	type: Types.SET_ORDER_ITEMS,
})

const addOrderItem = orderItem => (dispatch, getState) => {
	if (orderItem === undefined) return
	const { orderItems } = getState().order
	dispatch(setOrderItems([...orderItems, orderItem]))
}

const initialState = {
	orderItems: [],
}

export const Creators = {
	addOrderItem,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_ORDER_ITEMS:
			return {
				...state,
				orderItems: action.payload.orderItems,
			}
		default:
			return state
	}
}
