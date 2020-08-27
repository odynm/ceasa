import DeviceInfo from 'react-native-device-info'
import HttpService from 'src/services/httpService'

const prefix = 'loader/'
const Types = {
	SET_LOADER: prefix + 'SET_LOADER',
	SET_LOADING: prefix + 'SET_LOADING',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setLoader = loader => ({
	payload: { loader },
	type: Types.SET_LOADER,
})

const login = () => async dispatch => {
	dispatch(setLoading(true))
	const { success, data } = await HttpService.post('loader/login', {
		device: DeviceInfo.getDeviceId(),
	})
	if (success) {
		dispatch(setLoader(data))
	}
	dispatch(setLoading(false))
	return success
}

const create = name => async dispatch => {
	dispatch(setLoading(true))
	const { success, data } = await HttpService.post('loader', {
		device: DeviceInfo.getDeviceId(),
		name: name,
	})
	if (success) {
		//dispatch(setTeamCode(data.token))
	}
	dispatch(setLoading(false))
	return success
}

export const Creators = {
	login,
	create,
}

const initialState = {
	loader: {},
	loading: false,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADER:
			return { ...state, loader: action.payload.loader }
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		default:
			return state
	}
}
