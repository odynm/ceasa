import HttpService from 'src/services/httpService'
import StorageService from 'src/services/storageService'

const prefix = 'user/'
const Types = {
	LOGOUT: prefix + 'LOGOUT',
	SET_USER: prefix + 'SET_USER',
	SET_LOADING: prefix + 'SET_LOADING',
	LOAD_FROM_STORAGE: prefix + 'LOAD_FROM_STORAGE',
}

const login = (user, password) => async dispatch => {
	await dispatch(setLoading(true))
	const { data, success } = await HttpService.post('login', {
		login: user,
		password,
	})
	console.warn(success)
	console.warn(data)
	if (success) {
		await dispatch(setUser(data))
	}
	await dispatch(setLoading(false))

	return success
}

const updateToken = authToken => async dispatch => {
	// const user = await StorageService.user.get()
	// user.authToken = authToken
	// await dispatch(setToken(response.data))
	// return authToken
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setUser = user => async dispatch => {
	dispatch({
		type: Types.SET_USER,
		payload: { user },
	})
	await StorageService.user.set(user)
}

const loadLoggedUser = () => dispatch => {
	dispatch({ type: Types.LOAD_FROM_STORAGE })
	return StorageService.user.get().then(user => dispatch(setUser(user)))
}

const logout = () => async dispatch => {
	dispatch({ type: Types.LOGOUT })
	dispatch(setUser(initialState))

	await StorageService.user.remove()
}

const initialState = {
	user: {
		id: '',
		username: '',
		accessToken: '',
		refreshToken: '',
		creationDate: null,
	},
	loading: true,
}

export const Creators = {
	login,
	logout,
	setUser,
	updateToken,
	loadLoggedUser,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_USER:
			return {
				...state,
				user: action.payload.user,
			}
		default:
			return state
	}
}
