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

const loadAdditionalCosts = () => async (dispatch, getState) => {
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
		getState().additionalCost.additionalCosts?.length &&
		!data?.length
	) {
		dispatch(setAdditionalCosts([]))
	}
	dispatch(setLoading(false))
}

const deleteAdditionalCost = id => async (dispatch, getState) => {
	dispatch(setLoading(true))
	const { success } = await HttpService.delete(`additional-cost?id=${id}`)
	dispatch(setLoading(false))

	return success
}

// WARNING: only offline
const addAdditionalCostOffline = ({
	offlineId,
	costValue,
	description,
}) => async (dispatch, getState) => {
	const { additionalCosts } = getState().additionalCost

	const mappedItems = [
		{
			offlineId,
			description,
			costValue,
		},
		...additionalCosts,
	]

	dispatch(setAdditionalCosts(mappedItems))
}

// WARNING: only offline
const deleteAdditionalCostFromList = (id, offlineId) => async (
	dispatch,
	getState,
) => {
	console.warn(id, offlineId)
	const { additionalCosts } = getState().additionalCost

	const mappedItems = additionalCosts.filter(
		x => x.offlineId !== offlineId && x.id !== id,
	)

	dispatch(setAdditionalCosts(mappedItems))
}

export const Creators = {
	setLoading,
	addAdditionalCost,
	loadAdditionalCosts,
	deleteAdditionalCost,
	addAdditionalCostOffline,
	deleteAdditionalCostFromList,
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
