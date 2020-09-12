import commonObj from './common'
import HttpService from 'src/services/httpService'

const prefix = 'edit-order/'
const Types = {
	SET_ORDER: prefix + 'SET_ORDER',
	SET_URGENT: prefix + 'SET_URGENT',
	SET_STATUS: prefix + 'SET_STATUS',
	SET_CLIENT: prefix + 'SET_CLIENT',
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
	SET_CLIENT_STEP: prefix + 'SET_CLIENT_STEP',
	SET_CONFIRM_DELETE: prefix + 'SET_CONFIRM_DELETE',
	SET_PRODUCT_LIST_IS_DIRTY: prefix + 'SET_PRODUCT_LIST_IS_DIRTY',
}

const common = new commonObj(Types, 'editOrder')

const setUrgent = urgent => ({
	payload: { urgent },
	type: Types.SET_URGENT,
})

const setOrder = order => ({
	payload: { order },
	type: Types.SET_ORDER,
})

const setConfirmDelete = confirmDelete => ({
	payload: { confirmDelete },
	type: Types.SET_CONFIRM_DELETE,
})

const setProductListIsDirty = productListIsDirty => ({
	payload: { productListIsDirty },
	type: Types.SET_PRODUCT_LIST_IS_DIRTY,
})

const deleteOrder = async orderId => {
	const { success } = await HttpService.delete(`order?id=${orderId}`)
	console.warn(success)
}

const initialState = {
	id: 0,
	status: 0,
	urgent: false,
	orderItems: [],
	clientStep: false,
	confirmDelete: false,
	productListIsDirty: false,
	client: { key: '', place: '', vehicle: '' },
}

export const Creators = {
	setOrder: setOrder,
	setUrgent: setUrgent,
	deleteOrder: deleteOrder,
	setStatus: common.setStatus,
	setClient: common.setClient,
	sendOrder: common.sendOrder,
	resetOrder: common.resetOrder,
	addOrderItem: common.addOrderItem,
	setConfirmDelete: setConfirmDelete,
	setClientStep: common.setClientStep,
	setOrderItems: common.setOrderItems,
	setProductListIsDirty: setProductListIsDirty,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_ORDER:
			return {
				...state,
				status: action.payload.order.status,
				urgent: action.payload.order.urgent,
				client: action.payload.order.client,
				id: action.payload.order.id,
			}
		case Types.SET_STATUS:
			return {
				...state,
				status: action.payload.status,
			}
		case Types.SET_CLIENT:
			return {
				...state,
				client: action.payload.client,
			}
		case Types.SET_URGENT:
			return {
				...state,
				urgent: action.payload.urgent,
			}
		case Types.SET_ORDER_ITEMS:
			return {
				...state,
				orderItems: action.payload.orderItems,
			}
		case Types.SET_CLIENT_STEP:
			return {
				...state,
				clientStep: action.payload.clientStep,
			}
		case Types.SET_CONFIRM_DELETE:
			return {
				...state,
				confirmDelete: action.payload.confirmDelete,
			}
		case Types.SET_PRODUCT_LIST_IS_DIRTY:
			return {
				...state,
				productListIsDirty: action.payload.productListIsDirty,
			}
		default:
			return state
	}
}
