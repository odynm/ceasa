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
		if (index > 0) {
			orderItems[index] = orderItem
			dispatch(this.setOrderItems(orderItems))
		} else {
			dispatch(this.setOrderItems([...orderItems, orderItem]))
		}
	}

	this.sendOrder = () => async (_, getState) => {
		const {
			id,
			status,
			client,
			urgent,
			orderItems,
			generateLoad,
		} = getState()[duck]
		const postData = {
			id,
			client,
			status,
			urgent,
			generateLoad: generateLoad,
			products: orderItems.map(x => ({
				storageItem: x.id,
				unitPrice: x.unitPrice.value * 100,
				amount: x.amount,
			})),
		}
		const { success, data } = await HttpService.post('order', postData)
		console.warn(data)
		return success
	}
}

export default common
