const prefix = 'edit-storage/'
const Types = {
	SET_AMOUNT: prefix + 'SET_AMOUNT',
	SET_DESCRIPTION: prefix + 'SET_DESCRIPTION',
	SET_STORAGE_ITEM: prefix + 'SET_STORAGE_ITEM',
}

const setStorageItem = storageItem => ({
	payload: { storageItem },
	type: Types.SET_STORAGE_ITEM,
})

const setAmount = amount => ({
	payload: { amount },
	type: Types.SET_AMOUNT,
})

const setDescription = description => ({
	payload: { description },
	type: Types.SET_DESCRIPTION,
})

export const Creators = {
	setAmount,
	setStorageItem,
	setDescription,
}

const initialState = {
	storageItem: {
		id: 0,
		amount: 0,
		description: '',
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
		default:
			return state
	}
}
