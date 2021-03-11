const prefix = 'notifications/'
const Types = {
	SET_NOTIFICATIONS: prefix + 'SET_NOTIFICATIONS',
}

const addNotification = notification => async (dispatch, getState) => {
	const { notifications } = getState().notifications

	dispatch({
		payload: { notifications: [...notifications, notification] },
		type: Types.SET_NOTIFICATIONS,
	})
}

const popLastNotification = () => async (dispatch, getState) => {
	const { notifications } = getState().notifications

	dispatch({
		payload: { notifications: notifications.slice(1) },
		type: Types.SET_NOTIFICATIONS,
	})
}

export const Creators = {
	addNotification,
	popLastNotification,
}

const initialState = {
	// notification: {
	// type: 0,
	// open: false,
	// content: {},
	// }
	notifications: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_NOTIFICATIONS:
			return { ...state, notifications: action.payload.notifications }
		default:
			return state
	}
}
