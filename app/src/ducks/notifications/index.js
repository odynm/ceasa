const prefix = 'notifications/'
const Types = {
	SET_EDITION_MODAL: prefix + 'SET_EDITION_MODAL',
	SET_CANCELATION_MODAL: prefix + 'SET_CANCELATION_MODAL',
}

const setEditionModal = editionModal => ({
	payload: { editionModal },
	type: Types.SET_EDITION_MODAL,
})

const setCancelationModal = cancelationModal => ({
	payload: { cancelationModal },
	type: Types.SET_CANCELATION_MODAL,
})

export const Creators = {
	setEditionModal,
	setCancelationModal,
}

const initialState = {
	editionModal: {
		open: false,
		content: {},
	},
	cancelationModal: {
		open: false,
		content: {},
	},
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_EDITION_MODAL:
			return { ...state, editionModal: action.payload.editionModal }
		case Types.SET_CANCELATION_MODAL:
			return { ...state, cancelationModal: action.payload.cancelationModal }
		default:
			return state
	}
}
