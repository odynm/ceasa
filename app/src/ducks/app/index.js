const prefix = 'app/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_TIMEZONE: prefix + 'SET_TIMEZONE',
	SET_NO_CONNECTION: prefix + 'SET_NO_CONNECTION',
}

const setAppLoader = appLoader => ({
	payload: { appLoader },
	type: Types.SET_LOADING,
})

const setTimezone = timezone => ({
	payload: { timezone },
	type: Types.SET_TIMEZONE,
})

const setNoConnection = noConnection => ({
	payload: { noConnection },
	type: Types.SET_NO_CONNECTION,
})

export const Creators = {
	setTimezone,
	setAppLoader,
	setNoConnection,
}

const initialState = {
	timezone: '',
	appLoader: false,
	noConnection: false,
	currency: { name: 'BRL', text: 'R$', separator: ',' },
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, appLoader: action.payload.appLoader }
		case Types.SET_TIMEZONE:
			return { ...state, timezone: action.payload.timezone }
		case Types.SET_NO_CONNECTION:
			return { ...state, noConnection: action.payload.noConnection }
		default:
			return state
	}
}
