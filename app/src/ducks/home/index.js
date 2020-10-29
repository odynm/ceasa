import HttpService from 'src/services/httpService'
import MoneyService from 'src/services/moneyService'

const prefix = 'home/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
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

const loadHome = () => async dispatch => {
	dispatch(setLoading(true))
	const { data, success } = await HttpService.get('home')
	if (success && data && data.length > 0) {
		const mappedItems = data.map(x => ({
			...x,
			costPrice: MoneyService.toMoney(x.costPrice / 100),
			totalEarned: MoneyService.toMoney(x.totalEarned / 100),
			liquidEarned: MoneyService.toMoney(
				(x.totalEarned - x.costPrice * x.sold) / 100,
			),
			startingTotalItems: x.sold + x.amount,
		}))
		dispatch(setOverview(mappedItems))
	}
	dispatch(setLoading(false))
}

const initialState = {
	overview: [],
	loading: false,
}

export const Creators = {
	loadHome,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_OVERVIEW:
			return { ...state, overview: action.payload.overview }
		default:
			return state
	}
}
