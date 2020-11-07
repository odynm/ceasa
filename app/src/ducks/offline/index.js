import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as OrderCreators } from 'src/ducks/order'

const prefix = 'offline/'
const Types = {
	SET_QUEUE: prefix + 'SET_QUEUE',
	SET_IN_USE: prefix + 'SET_IN_USE',
	SET_ERRORS: prefix + 'SET_ERRORS',
	SET_LOADING: prefix + 'SET_LOADING',
	SET_EXECUTING_QUEUE: prefix + 'SET_EXECUTING_QUEUE',
}

const setInUse = inUse => ({
	payload: { inUse },
	type: Types.SET_IN_USE,
})

const setErrors = errors => ({
	payload: { errors },
	type: Types.SET_ERRORS,
})

const setQueue = queue => ({
	payload: { queue },
	type: Types.SET_QUEUE,
})

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setExecutingQueue = executingQueue => ({
	payload: { executingQueue },
	type: Types.SET_EXECUTING_QUEUE,
})

const addToQueue = () => async (dispatch, getState) => {
	dispatch(setInUse(true))
	dispatch(setLoading(true))
	const order = getState().order
	const { queue } = getState().offline
	const newQueue = [...queue, { ...order }]

	dispatch(setQueue(newQueue))
	dispatch(setLoading(false))
}

const executeQueue = () => async (dispatch, getState) => {
	const { executingQueue } = getState().offline
	if (executingQueue) {
		return
	}
	dispatch(AppCreators.setAppLoader(true))
	dispatch(setExecutingQueue(true))
	dispatch(setErrors([]))
	const { queue } = getState().offline
	queue.forEach(async order => {
		const { success, data } = await dispatch(
			await OrderCreators.sendOrder({ useParam: true, order: order }),
		)
		if (!success) {
			const { errors: curErrors } = getState().offline
			const newErrors = [...curErrors, data]
			dispatch(setErrors(newErrors))
		}
	})
	dispatch(setQueue([]))
	dispatch(setExecutingQueue(false))
	dispatch(setInUse(false))
	dispatch(AppCreators.setAppLoader(false))
}

export const Creators = {
	addToQueue,
	executeQueue,
}

const initialState = {
	queue: [],
	errors: [],
	inUse: false,
	loading: false,
	executingQueue: false,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_QUEUE:
			return { ...state, queue: action.payload.queue }
		case Types.SET_ERRORS:
			return { ...state, errors: action.payload.errors }
		case Types.SET_IN_USE:
			return { ...state, inUse: action.payload.inUse }
		case Types.SET_LOADING:
			return { ...state, loading: action.payload.loading }
		case Types.SET_EXECUTING_QUEUE:
			return { ...state, executingQueue: action.payload.executingQueue }

		default:
			return state
	}
}