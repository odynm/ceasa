import HttpService from 'src/services/httpService'

const prefix = 'client/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_CLIENTS: prefix + 'SET_CLIENTS',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setClients = clients => ({
	payload: { clients },
	type: Types.SET_CLIENTS,
})

const loadClients = () => async dispatch => {
	const { data, success } = await HttpService.get('clients')
	if (success && data) {
		dispatch(setClients(data))
	}
}

const initialState = {
	clients: [],
	loading: false,
}

export const Creators = {
	loadClients,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_CLIENTS:
			return { ...state, clients: action.payload.clients }
		default:
			return state
	}
}
