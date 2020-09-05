import commonObj from './common'
import orderStatus from 'src/enums/order'

const prefix = 'order/'
const Types = {
	SET_CLIENT: prefix + 'SET_CLIENT',
	SET_STATUS: prefix + 'SET_STATUS',
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
	SET_CLIENT_STEP: prefix + 'SET_CLIENT_STEP',
	SET_GENERATE_LOAD: prefix + 'SET_GENERATE_LOAD',
}

const common = new commonObj(Types, 'order')

const initialState = {
	orderItems: [],
	clientStep: false,
	generateLoad: true,
	status: orderStatus.released,
	client: { key: '', place: '', vehicle: '' },
}

export const Creators = {
	setClient: common.setClient,
	sendOrder: common.sendOrder,
	setStatus: common.setStatus,
	resetOrder: common.resetOrder,
	addOrderItem: common.addOrderItem,
	setClientStep: common.setClientStep,
	setGenerateLoad: common.setGenerateLoad,
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
		case Types.SET_GENERATE_LOAD:
			return {
				...state,
				generateLoad: action.payload.generateLoad,
			}
		default:
			return state
	}
}
