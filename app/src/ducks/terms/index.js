import HttpService from 'src/services/httpService'
import { getIp } from 'src/services/internetService'

const prefix = 'terms/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
}

const setLoading = (loading) => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const areTermsAccepted = () => async () => {
	const ipAddress = await getIp()
	const params = { ipAddress }
	const { data } = await HttpService.get('terms', { params })
	return data
}

const acceptTerms = () => async (dispatch) => {
	dispatch(setLoading(true))
	const ipAddress = await getIp()
	const { data } = await HttpService.post('terms', { ipAddress })
	return data
}

export const Creators = {
	setLoading,
	acceptTerms,
	areTermsAccepted,
}

const initialState = {
	loading: false,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		default:
			return state
	}
}
