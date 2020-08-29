import HttpService from 'src/services/httpService'

const prefix = 'orders-loader/'
const Types = {
	SET_ORDER_LIST: prefix + 'SET_ORDER_LIST',
	SET_SELECTED_ORDER_ID: prefix + 'SET_SELECTED_ORDER_ID',
}

const setOrderList = orderList => ({
	payload: { orderList },
	type: Types.SET_ORDER_LIST,
})

const setSelectedOrderId = selectedOrderId => ({
	payload: { selectedOrderId },
	type: Types.SET_SELECTED_ORDER_ID,
})

const loadOrders = () => async dispatch => {
	const { data, success } = await HttpService.get('order/loader')
	const mappedData = data.map(item => ({
		...item,
		createdAt: new Date(item.createdAt),
		releasedAt: new Date(item.releasedAt),
	}))
	if (success) {
		await dispatch(setOrderList(mappedData))
	}

	return success
}

const initialState = {
	orderList: [],
	selectedOrderId: 0,
}

export const Creators = {
	loadOrders,
	setSelectedOrderId,
}

export { Selectors } from './selectors'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_ORDER_LIST:
			return {
				...state,
				orderList: action.payload.orderList,
			}
		case Types.SET_SELECTED_ORDER_ID:
			return {
				...state,
				selectedOrderId: action.payload.selectedOrderId,
			}
		default:
			return state
	}
}
