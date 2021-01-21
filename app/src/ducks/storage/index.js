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

const add = item => async (dispatch, getStore) => {
	const { storedItems } = getStore().storage
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
		// Map item to be added/edited
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

		// Is adding?
		if (!item.id) {
			// Try to fully merge items (aka edit amount) or do a simple add
			const cur = storedItems && storedItems.length > 0 ? storedItems : []
			const { arr, merged } = MergedProductsService.addAndMergeSimilar(
				cur,
				mappedItemView,
			)

			// if succeeded in fully merging (aka edit amount) or adding
			if (merged) {
				dispatch(setStoredItems(MergedProductsService.sortProducts(arr)))
			}
			// if NOT succeeded in a full merge (aka edit amount)
			else {
				// Sort
				const current =
					storedItems && storedItems.length > 0 ? storedItems : []
				const newStoredItems = [...current, mappedItemView]
				dispatch(
					setStoredItems(
						MergedProductsService.sortProducts(newStoredItems),
					),
				)
			}
		}
		// is editing
		else {
			// If able, try to edit a simple (not merged) item first
			const indexStored = storedItems.findIndex(
				x => x.id === item.id && !x.isMerged,
			)

			if (indexStored >= 0) {
				const simpleEdit = (stored, index) => {
					return stored.map((x, i) =>
						i === index && !x.isMerged
							? {
									...x,
									amount: item.amount,
									costPrice: rfdc()(item.costPrice),
									description: item.description,
							  }
							: x,
					)
				}

				const newStoredItems = simpleEdit(storedItems, indexStored)

				dispatch(
					setStoredItems(
						MergedProductsService.sortProducts(newStoredItems),
					),
				)
			}
			// If not, edit the merged item
			else {
				const editMerged = stored => {
					return stored.map(storedItem => {
						if (storedItem.isMerged) {
							return {
								...storedItem,
								mergedData: {
									...storedItem.mergedData,
									items: storedItem.mergedData.items.map(
										mergedItem => {
											if (mergedItem.id === item.id) {
												return {
													...mergedItem,
													amount: item.amount,
													costPrice: rfdc()(item.costPrice),
													description: item.description,
												}
											} else {
												return mergedItem
											}
										},
									),
								},
							}
						} else {
							return storedItem
						}
					})
				}

				const newStoredItems = editMerged(storedItems)

				const updateAmounts = list => {
					return list.map(storedItem => {
						if (storedItem.isMerged) {
							return {
								...storedItem,
								amount: storedItem.mergedData.items.reduce(
									(prev, cur) => prev + cur.amount,
									0,
								),
							}
						} else {
							return storedItem
						}
					})
				}

				// We changed only the amounts inside the mergedData, now we need to update the outside sum of amounts
				const updatedOrders = updateAmounts(newStoredItems)

				dispatch(
					setStoredItems(
						MergedProductsService.sortProducts(updatedOrders),
					),
				)
			}
		}
	}

	return success
}

// TODO: this item currently only workd with the server online
const deleteItem = item => async (_, getStore) => {
	const { noConnection } = getStore().app
	// At least for now, don't touch the storage on offline mode
	if (!noConnection) {
		const { success } = await HttpService.delete(`storage?id=${item.id}`)
		return success
	} else {
		return false
	}
}

const get = () => async (dispatch, getStore) => {
	const { noConnection } = getStore().app
	// At least for now, don't touch the storage on offline mode
	if (!noConnection) {
		dispatch(setLoading(true))
		const { data, success } = await HttpService.get('storage')
		if (success && data?.length > 0) {
			const mappedItems = data.map(x => ({
				...x,
				costPrice: MoneyService.toMoney(x.costPrice / 100),
			}))
			const sorted = MergedProductsService.sortProducts(mappedItems)
			const merged = MergedProductsService.mergeSimilarItems(sorted)
			dispatch(setStoredItems(merged))
		} else if (
			success &&
			getStore().storage.storedItems?.length &&
			!data?.length
		) {
			dispatch(setStoredItems([]))
		}
		dispatch(setLoading(false))
	}
}

const initialState = {
	loading: false,
	working: false,
	storedItems: [],
}

export const Creators = {
	add,
	get,
	deleteItem,
	setWorking,
	setStoredItems,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_WORKING:
			return { ...state, loading: action.payload.working }
		case Types.SET_STORED_ITEMS:
			return { ...state, storedItems: rfdc()(action.payload.storedItems) }
		default:
			return state
	}
}
