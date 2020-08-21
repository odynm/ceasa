import HttpService from 'src/services/httpService'

const prefix = 'team/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_TEAM_CODE: prefix + 'SET_TEAM_CODE',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setTeamCode = teamCode => ({
	payload: { teamCode },
	type: Types.SET_TEAM_CODE,
})

const loadTeamCode = () => async dispatch => {
	dispatch(setLoading(true))
	const { success, data } = await HttpService.get('team/code')
	if (success) {
		dispatch(setTeamCode(data.token))
	}
	dispatch(setLoading(false))
}

export const Creators = {
	loadTeamCode,
}

const initialState = {
	teamCode: '',
	loading: false,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_TEAM_CODE:
			return { ...state, teamCode: action.payload.teamCode }
		default:
			return state
	}
}
