import HttpService from 'src/services/httpService'
import StorageService from 'src/services/storageService'

const prefix = 'user/'
const Types = {
	LOGOUT: prefix + 'LOGOUT',
	SET_USER: prefix + 'SET_USER',
	SET_LOADING: prefix + 'SET_LOADING',
	//REFRESH_TOKEN: prefix + 'UPDATE_TOKENS',
	LOAD_FROM_STORAGE: prefix + 'LOAD_FROM_STORAGE',
}

// const refreshToken = ({ accessToken, refreshToken }) => async (dispatch) => {
// 	const user = await StorageService.user.get()
// 	user.accessToken = accessToken
// 	user.refreshToken = refreshToken

// 	await dispatch(setUser(user))

// 	dispatch({
// 		type: Types.UPDATE_TOKENS,
// 		payload: { accessToken, refreshToken },
// 	})

// 	return { accessToken, refreshToken }
// }

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const loadLoggedUser = () => dispatch => {
	dispatch({ type: Types.LOAD_FROM_STORAGE })
	return StorageService.user.get().then(user => dispatch(setUser(user)))
}

const setUser = user => dispatch => {
	dispatch({ type: Types.SET_USER, payload: user })
	return StorageService.user.set(user)
}

const logout = () => async dispatch => {
	dispatch({ type: Types.LOGOUT })
	dispatch(setUser(initialState))

	await StorageService.user.remove()
}

const initialState = {
	id: '',
	name: '',
	email: '',
	roles: [],
	userType: '',
	fullName: '',
	avatarUrl: '',
	loading: true,
	accessToken: '',
	refreshToken: '',
	creationDate: null,
}

export const Creators = {
	logout,
	setUser,
	//refreshToken,
	loadLoggedUser,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_USER:
			return {
				...state,
				id: action.payload.id,
				name: action.payload.name,
				email: action.payload.email,
				roles: action.payload.roles,
				userType: action.payload.userType,
				fullName: action.payload.fullName,
				avatarUrl: action.payload.avatarUrl,
				accessToken: action.payload.accessToken,
				creationDate: action.payload.creationDate,
				refreshToken: action.payload.refreshToken,
			}
		default:
			return state
	}
}
