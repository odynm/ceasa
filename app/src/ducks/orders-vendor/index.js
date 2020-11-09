import sort from '../order/sort'
import HttpService from 'src/services/httpService'

const prefix = 'order-vendor/'
const Types = {
	SET_ORDER_LIST: prefix + 'SET_ORDER_LIST',
}

const setOrderList = orderList => ({
	payload: { orderList },
	type: Types.SET_ORDER_LIST,
})

const loadOrders = () => async dispatch => {
	const { data, success } = await HttpService.get('order')
	if (success) {
		if (!data) {
			await dispatch(setOrderList([]))
			return
		}

		const mappedData = data.map(item => ({
			...item,
			createdAt: new Date(item.createdAt),
			releasedAt: new Date(item.releasedAt),
		}))
		const orderedData = mappedData.sort((a, b) => {
			return sort(a, b)
		})
		await dispatch(setOrderList(orderedData))
	}

	return success
}

const initialState = {
	orderList: [],
}

export const Creators = {
	loadOrders,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_ORDER_LIST:
			return {
				...state,
				orderList: action.payload.orderList,
			}
		default:
			return state
	}
}
