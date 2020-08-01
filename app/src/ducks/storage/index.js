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
		product: item.selectedProductId,
		productType: item.selectedTypeId,
		description: item.additionalDescription,
		amount: item.amount,
	}
	const { success, data } = await HttpService.post('storage', mappedItemServer)

	if (success) {
		const mappedItemView = {
			id: data,
			productName: products.find(x => x.id === item.selectedProductId).name,
			productTypeName:
				item.selectedTypeId > 0
					? productTypes.find(x => x.id === item.selectedTypeId).name
					: '',
			description: item.additionalDescription,
			amount: item.amount,
		}
		const newStoredItems = [...storedItems, mappedItemView]
		dispatch(setStoredItems(newStoredItems))

		const newStoredItemsOrderAware = [
			...storedItemsOrderAware,
			mappedItemView,
		]
		dispatch(setStoredItemsOrderAware(newStoredItemsOrderAware))
	}

	return success
}

const get = () => async dispatch => {
	dispatch(setLoading(true))
	const { data, success } = await HttpService.get('storage')
	if (success) {
		dispatch(setStoredItems(data))
		dispatch(setStoredItemsOrderAware(data))
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
	setWorking,
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
