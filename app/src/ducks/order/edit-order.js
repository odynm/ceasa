import commonObj from './common'

const prefix = 'edit-order/'
const Types = {
	SET_URGENT: prefix + 'SET_URGENT',
	SET_STATUS: prefix + 'SET_STATUS',
	SET_CLIENT: prefix + 'SET_CLIENT',
	SET_RELEASED: prefix + 'SET_RELEASED',
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
	SET_CLIENT_STEP: prefix + 'SET_CLIENT_STEP',
}

const common = new commonObj(Types)

const setStatus = status => ({
	payload: { status },
	type: Types.SET_STATUS,
})

const setUrgent = urgent => ({
	payload: { urgent },
	type: Types.SET_URGENT,
})

const initialState = {
	status: 0,
	urgent: false,
	released: true,
	orderItems: [],
	clientStep: false,
	client: { key: '', place: '', vehicle: '' },
}

export const Creators = {
	setStatus: setStatus,
	setUrgent: setUrgent,
	setClient: common.setClient,
	sendOrder: common.sendOrder,
	resetOrder: common.resetOrder,
	setReleased: common.setReleased,
	addOrderItem: common.addOrderItem,
	setClientStep: common.setClientStep,
	setOrderItems: common.setOrderItems,
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
		case Types.SET_RELEASED:
			return {
				...state,
				released: action.payload.released,
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
		default:
			return state
	}
}
