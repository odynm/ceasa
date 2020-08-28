import HttpService from 'src/services/httpService'

const prefix = 'team/'
const Types = {
	SET_LOADING: prefix + 'SET_LOADING',
	SET_TEAM_CODE: prefix + 'SET_TEAM_CODE',
	SET_LOADER_TEAMS: prefix + 'SET_LOADER_TEAMS',
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setTeamCode = teamCode => ({
	payload: { teamCode },
	type: Types.SET_TEAM_CODE,
})

const setLoaderTeams = loaderTeams => ({
	payload: { loaderTeams },
	type: Types.SET_LOADER_TEAMS,
})

const loadTeamCode = () => async dispatch => {
	dispatch(setLoading(true))
	const { success, data } = await HttpService.get('team/code')
	if (success) {
		dispatch(setTeamCode(data.token))
	}
	dispatch(setLoading(false))
}

const loadLoaderTeams = () => async dispatch => {
	dispatch(setLoading(true))
	const { success, data } = await HttpService.get('team')
	if (success) {
		dispatch(setLoaderTeams(data))
	}
	dispatch(setLoading(false))
}

const joinTeam = code => async dispatch => {
	dispatch(setLoading(true))
	const { success, data } = await HttpService.post('team/join', {
		token: code,
	})
	console.warn(success, data)
	if (success) {
		//dispatch(setTeamCode(data.token))
	}
	dispatch(setLoading(false))
}

export const Creators = {
	joinTeam,
	loadTeamCode,
	loadLoaderTeams,
}

const initialState = {
	teamCode: '',
	loading: false,
	loaderTeams: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_TEAM_CODE:
			return { ...state, teamCode: action.payload.teamCode }
		case Types.SET_LOADER_TEAMS:
			return { ...state, loaderTeams: action.payload.loaderTeams }
		default:
			return state
	}
}
