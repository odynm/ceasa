import HttpService from 'src/services/httpService'
import StorageService from 'src/services/storageService'

const prefix = 'user/'
const Types = {
	LOGOUT: prefix + 'LOGOUT',
	SET_USER: prefix + 'SET_USER',
	SET_TOKEN: prefix + 'SET_TOKEN',
	SET_LOADING: prefix + 'SET_LOADING',
	LOAD_FROM_STORAGE: prefix + 'LOAD_FROM_STORAGE',
}

const login = (user, password) => async dispatch => {
	await dispatch(setLoading(true))
	const response = await HttpService.post('login', {
		login: user,
		password,
	})
	console.warn(response)
	// check if success true
	await StorageService.user.set({ username: user })
	await dispatch(setToken(response))
	await dispatch(setLoading(false))

	return response
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

const setToken = data => ({
	type: Types.SET_TOKEN,
	payload: data,
})

const setUser = user => dispatch => {
	dispatch({
		type: Types.SET_USER,
		payload: user,
	})
	return StorageService.user.set(user)
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
	id: '',
	name: '',
	roles: [],
	username: '',
	userType: '',
	fullName: '',
	avatarUrl: '',
	loading: true,
	accessToken: '',
	refreshToken: '',
	creationDate: null,
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
				//id: action.payload.id,
				name: action.payload.name,
				roles: action.payload.roles,
				username: action.payload.username,
				userType: action.payload.userType,
				fullName: action.payload.fullName,
				avatarUrl: action.payload.avatarUrl,
				creationDate: action.payload.creationDate,
			}
		case Types.SET_TOKEN:
			return {
				...state,
				accessToken: action.payload.Token,
				id: action.payload.Id,
			}
		default:
			return state
	}
}
