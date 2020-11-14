import rfdc from 'rfdc'
import HttpService from 'src/services/httpService'
import MoneyService from 'src/services/moneyService'
import MergedProductsService from 'src/services/mergedProductsService'

export { Selectors } from './selectors'

const prefix = 'storage/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_WORKING: prefix + 'SET_WORKING',
	SET_STORED_ITEMS: prefix + 'SET_STORED_ITEMS',
	SET_STORED_ITEMS_ORDER_AWARE: prefix + 'SET_STORED_ITEMS_ORDER_AWARE',
	SET_STORED_ITEMS_ORDER_AWARE_EDIT:
		prefix + 'SET_STORED_ITEMS_ORDER_AWARE_EDIT',
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

const setStoredItemsOrderAwareEdit = storedItemsOrderAwareEdit => ({
	payload: { storedItemsOrderAwareEdit },
	type: Types.SET_STORED_ITEMS_ORDER_AWARE_EDIT,
})

const resetStorageOrder = () => (dispatch, getState) => {
	const { storedItems } = getState().storage
	dispatch(setStoredItemsOrderAware(rfdc()(storedItems)))
	dispatch(setLoading(false))
	dispatch(setWorking(false))
}

const setItemsOrder = ({ id, amount }) => (dispatch, getStore) => {
	const { storedItemsOrderAware } = getStore().storage
	const index = storedItemsOrderAware.findIndex(x => x.id === id)
	const item = storedItemsOrderAware[index]
	const newAmount = amount
	const newStoredItemsOrderAware = [...storedItemsOrderAware]
	if (item) {
		newStoredItemsOrderAware[index].amount = newAmount
		dispatch(setStoredItemsOrderAware(newStoredItemsOrderAware))
	}
}

const increaseItemsOrder = ({ id, amount }) => (dispatch, getStore) => {
	const { storedItemsOrderAware } = getStore().storage
	const index = storedItemsOrderAware.findIndex(x => x.id === id)
	const item = storedItemsOrderAware[index]
	const newAmount = item.amount + amount
	const newStoredItemsOrderAware = [...storedItemsOrderAware]
	if (item) {
		newStoredItemsOrderAware[index].amount = newAmount
		dispatch(setStoredItemsOrderAware(newStoredItemsOrderAware))
	}
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

const decreaseItemsOrderEdit = ({ id, amount }) => (dispatch, getStore) => {
	const { storedItemsOrderAwareEdit } = getStore().storage
	const index = storedItemsOrderAwareEdit.findIndex(x => x.id === id)
	const item = storedItemsOrderAwareEdit[index]
	const newAmount = item.amount - amount >= 0 ? item.amount - amount : 0
	const newStoredItemsOrderAwareEdit = [...storedItemsOrderAwareEdit]
	if (item) {
		newStoredItemsOrderAwareEdit[index].amount = newAmount
		dispatch(setStoredItemsOrderAwareEdit(newStoredItemsOrderAwareEdit))
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
		costPrice: Math.round(item.costPrice.value * 100),
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
			costPrice: rfdc()(item.costPrice),
		}

		const cur = storedItems && storedItems.length > 0 ? storedItems : []
		const { arr, merged } = MergedProductsService.addAndMergeSimilar(
			cur,
			mappedItemView,
		)

		if (merged) {
			dispatch(setStoredItems(MergedProductsService.ortProducts(arr)))
			dispatch(
				setStoredItemsOrderAware(
					MergedProductsService.sortProducts([...arr]),
				),
			) // TODO the spread here is probably not needed. Test it
		} else {
			if (!item.id) {
				const current =
					storedItems && storedItems.length > 0 ? storedItems : []
				const newStoredItems = [...current, mappedItemView]
				dispatch(
					setStoredItems(
						MergedProductsService.sortProducts(newStoredItems),
					),
				)

				const currentOrderAware =
					storedItemsOrderAware && storedItemsOrderAware.length > 0
						? storedItemsOrderAware
						: []
				const newStoredItemsOrderAware = [
					...currentOrderAware,
					mappedItemView,
				]
				dispatch(
					setStoredItemsOrderAware(
						MergedProductsService.sortProducts(newStoredItemsOrderAware),
					),
				)
			} else {
				const index = storedItems.findIndex(x => x.id === item.id)
				const newStoredItems = storedItems.map((x, i) =>
					i === index
						? {
								...x,
								amount: item.amount,
								costPrice: rfdc()(item.costPrice),
								description: item.description,
						  }
						: x,
				)
				dispatch(
					setStoredItems(
						MergedProductsService.sortProducts(newStoredItems),
					),
				)

				const indexOrderAware = storedItemsOrderAware.findIndex(
					x => x.id === item.id,
				)
				const newStoredItemsOrderAware = storedItemsOrderAware.map((x, i) =>
					i === indexOrderAware
						? {
								...x,
								amount: item.amount,
								costPrice: rfdc()(item.costPrice),
								description: item.description,
						  }
						: x,
				)
				dispatch(
					setStoredItems(
						MergedProductsService.sortProducts(newStoredItemsOrderAware),
					),
				)
			}
		}
	}

	return success
}

const deleteItem = item => async (_, getStore) => {
	const { inUse } = getStore().offline
	// At least for now, don't touch the storage on offline mode
	if (!inUse) {
		const { success } = await HttpService.delete(`storage?id=${item.id}`)
		return success
	} else {
		return false
	}
}

const get = () => async (dispatch, getStore) => {
	const { inUse } = getStore().offline
	// At least for now, don't touch the storage on offline mode
	if (!inUse) {
		dispatch(setLoading(true))
		const { data, success } = await HttpService.get('storage')
		if (success && data && data.length > 0) {
			const mappedItems = data.map(x => ({
				...x,
				costPrice: MoneyService.toMoney(x.costPrice / 100),
			}))
			const sorted = MergedProductsService.sortProducts(mappedItems)
			const merged = MergedProductsService.mergeSimilarItems(sorted)
			dispatch(setStoredItems(merged))

			// sell items
			const { orderItems } = getStore().order
			if (orderItems === undefined || orderItems.length === 0) {
				dispatch(setStoredItemsOrderAware(rfdc()(merged)))
			}
			// edit items
			const { orderItems: orderItemsEdit } = getStore().editOrder
			if (orderItemsEdit.id === undefined || orderItemsEdit.id === 0) {
				// The edit needs the data without the merges
				dispatch(setStoredItemsOrderAwareEdit(rfdc()(mappedItems)))
			}
		}
		dispatch(setLoading(false))
	}
}

const initialState = {
	loading: false,
	working: false,
	storedItems: [],
	storedItemsOrderAware: [], // on create order
	storedItemsOrderAwareEdit: [], // on edit order
}

export const Creators = {
	add,
	get,
	deleteItem,
	setWorking,
	setItemsOrder,
	setStoredItems,
	resetStorageOrder,
	decreaseItemsOrder,
	increaseItemsOrder,
	decreaseItemsOrderEdit,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_WORKING:
			return { ...state, loading: action.payload.working }
		case Types.SET_STORED_ITEMS:
			return { ...state, storedItems: rfdc()(action.payload.storedItems) }
		case Types.SET_STORED_ITEMS_ORDER_AWARE:
			return {
				...state,
				storedItemsOrderAware: action.payload.storedItemsOrderAware,
			}
		case Types.SET_STORED_ITEMS_ORDER_AWARE_EDIT:
			return {
				...state,
				storedItemsOrderAwareEdit: action.payload.storedItemsOrderAwareEdit,
			}
		default:
			return state
	}
}
