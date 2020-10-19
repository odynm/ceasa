const prefix = 'edit-storage/'
const Types = {
	SET_AMOUNT: prefix + 'SET_AMOUNT',
	SET_COST_PRICE: prefix + 'SET_COST_PRICE',
	SET_DESCRIPTION: prefix + 'SET_DESCRIPTION',
	SET_STORAGE_ITEM: prefix + 'SET_STORAGE_ITEM',
	SET_CONFIRM_DELETE: prefix + 'SET_CONFIRM_DELETE',
}

const setStorageItem = storageItem => ({
	payload: { storageItem },
	type: Types.SET_STORAGE_ITEM,
})

const setAmount = amount => ({
	payload: { amount },
	type: Types.SET_AMOUNT,
})

const setCostPrice = costPrice => ({
	payload: { costPrice },
	type: Types.SET_COST_PRICE,
})

const setDescription = description => ({
	payload: { description },
	type: Types.SET_DESCRIPTION,
})

const setConfirmDelete = confirmDelete => ({
	payload: { confirmDelete },
	type: Types.SET_CONFIRM_DELETE,
})

export const Creators = {
	setAmount,
	setCostPrice,
	setStorageItem,
	setDescription,
	setConfirmDelete,
}

const initialState = {
	confirmDelete: false,
	storageItem: {
		id: 0,
		amount: 0,
		description: '',
		costPrice: '0,00',
	},
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_AMOUNT:
			return {
				...state,
				storageItem: {
					...state.storageItem,
					amount: action.payload.amount,
				},
			}
		case Types.SET_COST_PRICE:
			return {
				...state,
				storageItem: {
					...state.storageItem,
					costPrice: action.payload.costPrice,
				},
			}
		case Types.SET_DESCRIPTION:
			return {
				...state,
				storageItem: {
					...state.storageItem,
					description: action.payload.description,
				},
			}
		case Types.SET_STORAGE_ITEM:
			return { ...state, storageItem: action.payload.storageItem }
		case Types.SET_CONFIRM_DELETE:
			return {
				...state,
				confirmDelete: action.payload.confirmDelete,
			}
		default:
			return state
	}
}
