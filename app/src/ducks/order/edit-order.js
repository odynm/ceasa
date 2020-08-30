import commonObj from './common'

const prefix = 'edit-order/'
const Types = {
	SET_URGENT: prefix + 'SET_URGENT',
	SET_STATUS: prefix + 'SET_STATUS',
	SET_CLIENT: prefix + 'SET_CLIENT',
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
	SET_CLIENT_STEP: prefix + 'SET_CLIENT_STEP',
	SET_PRODUCT_LIST_IS_DIRTY: prefix + 'SET_PRODUCT_LIST_IS_DIRTY',
}

const common = new commonObj(Types, 'editOrder')

const setStatus = status => ({
	payload: { status },
	type: Types.SET_STATUS,
})

const setUrgent = urgent => ({
	payload: { urgent },
	type: Types.SET_URGENT,
})

const setProductListIsDirty = productListIsDirty => ({
	payload: { productListIsDirty },
	type: Types.SET_PRODUCT_LIST_IS_DIRTY,
})

const initialState = {
	status: 0,
	urgent: false,
	orderItems: [],
	clientStep: false,
	productListIsDirty: false,
	client: { key: '', place: '', vehicle: '' },
}

export const Creators = {
	setStatus: setStatus,
	setUrgent: setUrgent,
	setClient: common.setClient,
	sendOrder: common.sendOrder,
	resetOrder: common.resetOrder,
	addOrderItem: common.addOrderItem,
	setClientStep: common.setClientStep,
	setOrderItems: common.setOrderItems,
	setProductListIsDirty: setProductListIsDirty,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
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
		case Types.SET_PRODUCT_LIST_IS_DIRTY:
			return {
				...state,
				productListIsDirty: action.payload.productListIsDirty,
			}
		default:
			return state
	}
}