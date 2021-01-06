import HttpService from 'src/services/httpService'
import MoneyService from 'src/services/moneyService'
import MergedProductsService from 'src/services/mergedProductsService'

const prefix = 'home/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_BALANCE: prefix + 'SET_BALANCE',
	SET_OVERVIEW: prefix + 'SET_OVERVIEW',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setOverview = overview => ({
	payload: { overview },
	type: Types.SET_OVERVIEW,
})

const setBalance = balance => ({
	payload: { balance },
	type: Types.SET_BALANCE,
})

const loadHome = () => async (dispatch, getStore) => {
	const { data, success } = await HttpService.get('home')
	if (success && data?.list?.length > 0) {
		dispatch(setBalance(data.balance))

		const mappedItems = data.list.map(x => ({
			...x,
			costPrice: MoneyService.toMoney(x.costPrice / 100),
			totalEarned: MoneyService.toMoney(x.totalEarned / 100),
			liquidEarned: MoneyService.toMoney(
				(x.totalEarned - x.costPrice * x.sold) / 100,
			),
			startingTotalItems: x.sold + x.amount,
		}))

		const sortedItems = MergedProductsService.sortProducts(mappedItems)

		dispatch(setOverview(sortedItems))
	} else if (
		success &&
		getStore().home.overview?.length &&
		!data?.list?.length
	) {
		// If there's already items on overview but none on the comming request, we need to nulify them
		dispatch(setOverview([]))
	}
}

const resetStorage = () => async dispatch => {
	setLoading(true)
	const { success } = await HttpService.get('storage/reset')
	if (success) {
		await dispatch(loadHome())
	}
	setLoading(false)
}

const initialState = {
	balance: {},
	overview: [],
	loading: false,
}

export const Creators = {
	loadHome,
	resetStorage,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_BALANCE:
			return { ...state, balance: action.payload.balance }
		case Types.SET_OVERVIEW:
			return { ...state, overview: action.payload.overview }
		default:
			return state
	}
}
