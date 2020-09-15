import rfdc from 'rfdc'
import HttpService from 'src/services/httpService'

const prefix = 'storage/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_WORKING: prefix + 'SET_WORKING',
	SET_STORED_ITEMS: prefix + 'SET_STORED_ITEMS',
	SET_STORED_ITEMS_ORDER_AWARE: prefix + 'SET_STORED_ITEMS_ORDER_AWARE',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setWorking = working => ({
	payload: { working },
	type: Types.SET_WORKING,
})

const setStoredItems = storedItems => ({
	payload: { storedItems },
	type: Types.SET_STORED_ITEMS,
})

const setStoredItemsOrderAware = storedItemsOrderAware => ({
	payload: { storedItemsOrderAware },
	type: Types.SET_STORED_ITEMS_ORDER_AWARE,
})

const resetStorageOrder = () => (dispatch, getState) => {
	const { storedItems } = getState().storage
	dispatch(setStoredItemsOrderAware(rfdc()(storedItems)))
	dispatch(setLoading(false))
	dispatch(setWorking(false))
}

const decreaseItemsOrder = ({ id, amount }) => (dispatch, getStore) => {
	const { storedItemsOrderAware } = getStore().storage
	const index = storedItemsOrderAware.findIndex(x => x.id === id)
	const item = storedItemsOrderAware[index]
	const newAmount = item.amount - amount >= 0 ? item.amount - amount : 0
	const newStoredItemsOrderAware = [...storedItemsOrderAware]
	if (item) {
		newStoredItemsOrderAware[index].amount = newAmount
		dispatch(setStoredItemsOrderAware(newStoredItemsOrderAware))
	}
}

const add = item => async (dispatch, getStore) => {
	const { storedItems, storedItemsOrderAware } = getStore().storage
	const { products, productTypes } = getStore().products

	const mappedItemServer = {
		id: item.id,
		amount: item.amount,
		product: item.productId,
		description: item.description,
		productType: item.productTypeId,
	}

	const { success, data } = await HttpService.post('storage', mappedItemServer)

	if (success) {
		const mappedItemView = {
			id: data,
			productName: products.find(x => x.id === item.productId).name,
			productTypeName:
				item.productTypeId > 0
					? productTypes.find(x => x.id === item.productTypeId).name
					: '',
			description: item.description,
			amount: item.amount,
		}
		if (item.id === 0) {
			const current =
				storedItems && storedItems.length > 0 ? storedItems : []
			const newStoredItems = [...current, mappedItemView]
			dispatch(setStoredItems(newStoredItems))

			const currentOrderAware =
				storedItemsOrderAware && storedItemsOrderAware.length > 0
					? storedItemsOrderAware
					: []
			const newStoredItemsOrderAware = [...currentOrderAware, mappedItemView]
			dispatch(setStoredItemsOrderAware(newStoredItemsOrderAware))
		} else {
			const index = storedItems.findIndex(x => x.id === item.id)
			const newStoredItems = storedItems.map((x, i) =>
				i === index
					? { ...x, amount: item.amount, description: item.description }
					: x,
			)
			dispatch(setStoredItems(newStoredItems))

			const indexOrderAware = storedItemsOrderAware.findIndex(
				x => x.id === item.id,
			)
			const newStoredItemsOrderAware = storedItemsOrderAware.map((x, i) =>
				i === indexOrderAware
					? { ...x, amount: item.amount, description: item.description }
					: x,
			)
			dispatch(setStoredItems(newStoredItemsOrderAware))
		}
	}

	return success
}

const deleteItem = item => async () => {
	const { success } = await HttpService.delete(`storage?id=${item.id}`)
	return success
}

const get = () => async (dispatch, getStore) => {
	dispatch(setLoading(true))
	const { data, success } = await HttpService.get('storage')
	if (success) {
		dispatch(setStoredItems(data))

		const { orderItems } = getStore().order
		if (orderItems || orderItems.length === 0) {
			dispatch(setStoredItemsOrderAware(rfdc()(data)))
		}
	}
	dispatch(setLoading(false))
}

const initialState = {
	loading: false,
	working: false,
	storedItems: [],
	storedItemsOrderAware: [],
}

export const Creators = {
	add,
	get,
	deleteItem,
	setWorking,
	resetStorageOrder,
	decreaseItemsOrder,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_WORKING:
			return { ...state, loading: action.payload.working }
		case Types.SET_STORED_ITEMS:
			return { ...state, storedItems: action.payload.storedItems }
		case Types.SET_STORED_ITEMS_ORDER_AWARE:
			return {
				...state,
				storedItemsOrderAware: action.payload.storedItemsOrderAware,
			}
		default:
			return state
	}
}
