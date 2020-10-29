import HttpService from 'src/services/httpService'

function common(types, duck) {
	this.setClient = client => ({
		payload: { client },
		type: types.SET_CLIENT,
	})

	this.setStatus = status => ({
		payload: { status },
		type: types.SET_STATUS,
	})

	this.setOrderItems = orderItems => ({
		payload: { orderItems },
		type: types.SET_ORDER_ITEMS,
	})

	this.setClientStep = clientStep => ({
		payload: { clientStep },
		type: types.SET_CLIENT_STEP,
	})

	this.setGenerateLoad = generateLoad => ({
		payload: { generateLoad },
		type: types.SET_GENERATE_LOAD,
	})

	this.resetOrder = () => dispatch => {
		dispatch(this.setClientStep(false))
		dispatch(this.setGenerateLoad(true))
		dispatch(this.setOrderItems([]))
		dispatch(this.setClient({ key: '', place: '', vehicle: '' }))
	}

	this.addOrderItem = orderItem => (dispatch, getState) => {
		if (orderItem === undefined) return
		const { orderItems } = getState()[duck]
		const index = orderItems.findIndex(x => x.id === orderItem.id)
		if (index >= 0) {
			orderItems[index] = orderItem
			dispatch(this.setOrderItems(orderItems))
		} else {
			dispatch(this.setOrderItems([...orderItems, orderItem]))
		}
	}

	this.removeOrderItem = orderItem => (dispatch, getState) => {
		if (orderItem === undefined) return
		const { orderItems } = getState()[duck]
		const newOrderItems = orderItems.filter(x => x.id !== orderItem.id)
		dispatch(this.setOrderItems(newOrderItems))
	}

	this.sendOrder = ({ useParam, order } = {}) => async (_, getState) => {
		const source = useParam ? order : getState()[duck]
		const {
			id,
			status,
			client,
			urgent,
			orderItems,
			generateLoad,
			productListIsDirty = false,
		} = source
		const postData = {
			id,
			client,
			status,
			urgent,
			generateLoad: generateLoad,
			products: orderItems.map(x => ({
				storageItem: x.storageId,
				unitPrice: Math.round(x.unitPrice.value * 100),
				amount: x.amount,
			})),
			productListIsDirty,
		}
		console.warn(postData)
		const data = await HttpService.post('order', postData)
		return data
	}
}

export default common
