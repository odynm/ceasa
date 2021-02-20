import { jobTypes } from './jobTypes'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as OrderCreators } from 'src/ducks/order'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import { Creators as AdditionalCostCreators } from 'src/ducks/additional-cost'
import StorageService from 'src/services/storageService'

const prefix = 'offline/'
const Types = {
	SET_QUEUE: prefix + 'SET_QUEUE',
	SET_IN_USE: prefix + 'SET_IN_USE',
	SET_ERRORS: prefix + 'SET_ERRORS',
	SET_LOADING: prefix + 'SET_LOADING',
	SET_EXECUTING_QUEUE: prefix + 'SET_EXECUTING_QUEUE',
}

const setInUse = inUse => {
	StorageService.offlineInUse.set(inUse)

	return {
		payload: { inUse },
		type: Types.SET_IN_USE,
	}
}

const setErrors = errors => ({
	payload: { errors },
	type: Types.SET_ERRORS,
})

const setQueue = queue => {
	StorageService.offlineQueue.set(queue)

	return {
		payload: { queue },
		type: Types.SET_QUEUE,
	}
}

const setLoading = loading => ({
	payload: { loading },
	type: Types.SET_LOADING,
})

const setExecutingQueue = executingQueue => ({
	payload: { executingQueue },
	type: Types.SET_EXECUTING_QUEUE,
})

// delete order
const deleteOrder = (id, offlineId) => async (dispatch, getState) => {
	dispatch(setInUse(true))
	dispatch(setLoading(true))

	const { queue } = getState().offline
	const hasItem = queue.some(item => item.data.offlineId === offlineId)

	if (hasItem) {
		const newQueue = queue.filter(item => item.data.offlineId !== offlineId)
		dispatch(setQueue(newQueue))
	} else {
		const newQueue = [...queue, { jobType: jobTypes.deleteOrder, data: id }]
		dispatch(setQueue(newQueue))
	}

	dispatch(setLoading(false))
}

// delete additionalCost
const deleteAdditionalCost = (id, offlineId) => async (dispatch, getState) => {
	dispatch(setInUse(true))
	dispatch(setLoading(true))

	const { queue } = getState().offline
	const hasItem = queue.some(item => item.data.offlineId === offlineId)

	if (hasItem) {
		const newQueue = queue.filter(item => item.data.offlineId !== offlineId)
		dispatch(setQueue(newQueue))
	} else {
		const newQueue = [
			...queue,
			{ jobType: jobTypes.deleteAdditionalCost, data: id },
		]
		dispatch(setQueue(newQueue))
	}

	dispatch(setLoading(false))
}

// add order or add additional cost
const addToQueue = (jobType, data) => async (dispatch, getState) => {
	dispatch(setInUse(true))
	dispatch(setLoading(true))

	const { queue } = getState().offline
	const newQueue = [...queue, { jobType, data }]

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

	queue.forEach(async item => {
		let response
		switch (item.jobType) {
			case jobTypes.addOrder:
				response = await dispatch(
					OrderCreators.sendOrder({
						useParam: true,
						order: item.data,
					}),
				)
				break
			case jobTypes.deleteOrder:
				response = await dispatch(EditOrderCreators.deleteOrder(item.data))
				break
			case jobTypes.addAdditionalCost:
				response = await dispatch(
					AdditionalCostCreators.addAdditionalCost(
						item.data.description,
						item.data.costValue,
					),
				)
				break
			case jobTypes.deleteAdditionalCost:
				response = await dispatch(
					AdditionalCostCreators.deleteAdditionalCost(item.data),
				)
				break
		}

		if (!response || !response.success) {
			const { errors: curErrors } = getState().offline
			const newErrors = [...curErrors, response.data]
			dispatch(setErrors(newErrors))
		}
	})

	dispatch(setQueue([]))
	dispatch(setExecutingQueue(false))
	dispatch(setInUse(false))
	dispatch(AppCreators.setAppLoader(false))
}

export const Creators = {
	setQueue,
	addToQueue,
	deleteOrder,
	executeQueue,
	deleteAdditionalCost,
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
