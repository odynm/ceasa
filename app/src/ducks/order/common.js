import orderStatus from 'src/enums/order'
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
        dispatch(this.setReleasedStatus(true))
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
        // Can come from parameter in the case of offline mode
        const source = useParam ? order : getState()[duck]
        const {
            id,
            loader,
            status,
            client,
            urgent,
            orderItems,
            generateLoad,
            productListIsDirty = false,
        } = source

        const products = []

        for (let i = 0; i < orderItems.length; i++) {
            const oi = orderItems[i]
            // We don't make discrimination between merged items and not-merged ones, because
            // this difference will be solved on the backend
            products.push({
                productId: oi.productId,
                productTypeId: oi.productTypeId,
                descriptionId: oi.descriptionId,
                unitPrice: Math.round(oi.unitPrice.value * 100),
                amount: oi.amount,
                storageAmount: oi.storageAmount,
            })
        }

        const postData = {
            id,
            client,
            status: loader ? orderStatus.carrying : status,
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
