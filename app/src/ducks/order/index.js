import commonObj from './common'

const prefix = 'order/'
const Types = {
	SET_CLIENT: prefix + 'SET_CLIENT',
	SET_RELEASED: prefix + 'SET_RELEASED',
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
	SET_CLIENT_STEP: prefix + 'SET_CLIENT_STEP',
	SET_GENERATE_LOAD: prefix + 'SET_GENERATE_LOAD',
}

const common = new commonObj(Types, 'order')

const initialState = {
	orderItems: [],
	released: true,
	clientStep: false,
	generateLoad: true,
	client: { key: '', place: '', vehicle: '' },
}

export const Creators = {
	setClient: common.setClient,
	sendOrder: common.sendOrder,
	resetOrder: common.resetOrder,
	setReleased: common.setReleased,
	addOrderItem: common.addOrderItem,
	setClientStep: common.setClientStep,
	setGenerateLoad: common.setGenerateLoad,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
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
