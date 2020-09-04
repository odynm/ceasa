const prefix = 'app/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
}

const setAppLoader = appLoader => ({
	payload: { appLoader },
	type: Types.SET_LOADING,
})

export const Creators = {
	setAppLoader,
}

const initialState = {
	appLoader: false,
	currency: { name: 'BRL', text: 'R$', separator: ',' },
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, appLoader: action.payload.appLoader }
		default:
			return state
	}
}
