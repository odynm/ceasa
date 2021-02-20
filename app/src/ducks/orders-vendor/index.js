import sort from '../order/sort'
import HttpService from 'src/services/httpService'
import StorageService from 'src/services/storageService'

const prefix = 'order-vendor/'
const Types = {
	SET_ORDER_LIST: prefix + 'SET_ORDER_LIST',
}

const setOrderList = orderList => {
	StorageService.offlineOrders.set(orderList)

	return {
		payload: { orderList },
		type: Types.SET_ORDER_LIST,
	}
}

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
			completedAt: new Date(item.completedAt),
		}))
		const orderedData = mappedData.sort((a, b) => {
			return sort(a, b)
		})
		await dispatch(setOrderList(orderedData))
	}

	return success
}

const createOfflineOrder = order => async (dispatch, getState) => {
	const { orderList } = getState().ordersVendor
	dispatch(setOrderList([order, ...orderList]))
}

// delete by id OR offline id (offline can be null)
const deleteOrder = (id, offlineId) => async (dispatch, getState) => {
	const { orderList } = getState().ordersVendor
	const orderListFiltered = orderList.filter(
		x => x.id !== id || (offlineId ? x.offlineId !== offlineId : false),
	)
	dispatch(setOrderList(orderListFiltered))
}

const initialState = {
	orderList: [],
}

export const Creators = {
	loadOrders,
	deleteOrder,
	setOrderList,
	createOfflineOrder,
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
