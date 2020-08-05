import HttpService from 'src/services/httpService'

const prefix = 'order/'
const Types = {
	SET_CLIENT: prefix + 'SET_CLIENT',
	SET_ORDER_ITEMS: prefix + 'SET_ORDER_ITEMS',
	SET_GENERATE_LOAD: prefix + 'SET_GENERATE_LOAD',
}

const setClient = client => ({
	payload: { client },
	type: Types.SET_CLIENT,
})

const setOrderItems = orderItems => ({
	payload: { orderItems },
	type: Types.SET_ORDER_ITEMS,
})

const setGenerateLoad = generateLoad => ({
	payload: { generateLoad },
	type: Types.SET_GENERATE_LOAD,
})

const resetOrder = () => dispatch => {
	dispatch(setGenerateLoad(true))
	dispatch(setOrderItems([]))
	dispatch(setClient({ key: '', place: '', vehicle: '' }))
}

const addOrderItem = orderItem => (dispatch, getState) => {
	if (orderItem === undefined) return
	const { orderItems } = getState().order
	dispatch(setOrderItems([...orderItems, orderItem]))
}

const sendOrder = () => async (dispatch, getState) => {
	const { client, orderItems, generateLoad } = getState().order
	const postData = {
		client,
		released: generateLoad,
		products: orderItems.map(x => ({
			storageItem: x.id,
			unitPrice: x.unitPrice.value * 100,
			amount: x.amount,
		})),
	}
	const { success, data } = await HttpService.post('order', postData)
	console.warn(data)
	return success
}

const initialState = {
	orderItems: [],
	generateLoad: true,
	client: { key: '', place: '', vehicle: '' },
}

export const Creators = {
	setClient,
	sendOrder,
	resetOrder,
	addOrderItem,
	setGenerateLoad,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
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
		case Types.SET_GENERATE_LOAD:
			return {
				...state,
				generateLoad: action.payload.generateLoad,
			}
		default:
			return state
	}
}
