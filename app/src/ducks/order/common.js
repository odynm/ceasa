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
		// Edit
		if (index >= 0) {
			orderItems[index] = orderItem
			dispatch(this.setOrderItems(orderItems))
		}
		// Add
		else {
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
		// Since we have merged items, we need to treat them to send as different
		// orders
		const products = []

		for (let i = 0; i < orderItems.length; i++) {
			const oi = orderItems[i]
			if (oi.isMerged) {
				const items = orderItems[i].mergedData.items
				let sent = 0
				for (let j = 0; j < items.length; j++) {
					if (sent < oi.amount) {
						const mergedItem = items[j]
						const toSend = Math.min(mergedItem.amount, oi.amount - sent)
						sent += toSend
						products.push({
							storageItem: mergedItem.storageId,
							unitPrice: Math.round(oi.unitPrice.value * 100),
							amount: toSend,
						})
					} else {
						break
					}
				}
			} else {
				products.push({
					storageItem: oi.storageId,
					unitPrice: Math.round(oi.unitPrice.value * 100),
					amount: oi.amount,
				})
			}
		}

		const postData = {
			id,
			client,
			status,
			urgent,
			generateLoad: generateLoad,
			products: products,
			productListIsDirty,
		}
		const data = await HttpService.post('order', postData)
		return data
	}
}

export default common
