import HttpService from 'src/services/httpService'

const prefix = 'storage/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_STORED_ITEMS: prefix + 'SET_STORED_ITEMS',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setStoredItems = storedItems => ({
	payload: { storedItems },
	type: Types.SET_STORED_ITEMS,
})

const add = item => async (dispatch, getStore) => {
	const { storedItems } = getStore().storage

	const mappedItem = {
		product: item.selectedProductId,
		productType: item.selectedTypeId,
		description: item.additionalDescription,
		amount: item.quantity,
	}
	const newStoredItems = [...storedItems, item]
	dispatch(setStoredItems(newStoredItems))
	const { data, success } = await HttpService.post('storage', mappedItem)
	// TODO caso falhe, precisamos dar o get novamente para ver o que realmente está salvo
}

const get = () => async dispatch => {
	dispatch(setLoading(true))
	const { data, success } = await HttpService.get('storage')
	if (success) {
		dispatch(setStoredItems(data))
	}
	dispatch(setLoading(false))
}

const initialState = {
	loading: false,
	storedItems: [],
}

export const Creators = {
	add,
	get,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_STORED_ITEMS:
			return { ...state, storedItems: action.payload.storedItems }
		default:
			return state
	}
}
