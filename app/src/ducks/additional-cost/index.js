import HttpService from 'src/services/httpService'
import MoneyService from 'src/services/moneyService'

const prefix = 'additional-cost/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_ADDITIONAL_COSTS: prefix + 'SET_ADDITIONAL_COSTS',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setAdditionalCosts = additionalCosts => ({
	payload: { additionalCosts },
	type: Types.SET_ADDITIONAL_COSTS,
})

const addAdditionalCost = (description, costValue) => async dispatch => {
	dispatch(setLoading(true))
	const { success } = await HttpService.post('additional-cost', {
		description,
		costValue: Math.round(costValue.value * 100),
	})

	dispatch(setLoading(false))
	return success
}

const loadAdditionalCosts = () => async (dispatch, getStore) => {
	dispatch(setLoading(true))
	const { data, success } = await HttpService.get('additional-cost')

	if (success && data?.length > 0) {
		const mappedItems = data.map(x => ({
			...x,
			costValue: MoneyService.toMoney(x.costValue / 100),
			createdAt: new Date(x.createdAt),
		}))

		dispatch(setAdditionalCosts(mappedItems))
	} else if (
		success &&
		getStore().home.additionalCosts?.length &&
		!data?.length
	) {
		dispatch(setAdditionalCosts([]))
	}
	dispatch(setLoading(false))
}

const deleteAdditionalCost = id => async (dispatch, getStore) => {
	const { noConnection } = getStore().app

	if (!noConnection) {
		dispatch(setLoading(true))
		const { success } = await HttpService.delete(`additional-cost?id=${id}`)
		dispatch(setLoading(false))

		return success
	} else {
		return false
	}
}

export const Creators = {
	setLoading,
	addAdditionalCost,
	loadAdditionalCosts,
	deleteAdditionalCost,
}

const initialState = {
	loading: false,
	additionalCosts: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_ADDITIONAL_COSTS:
			return { ...state, additionalCosts: action.payload.additionalCosts }
		default:
			return state
	}
}
