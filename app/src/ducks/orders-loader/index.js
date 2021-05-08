import sort from '../order/sort'
import HttpService from 'src/services/httpService'
import MergedProductsService from 'src/services/mergedProductsService'

const prefix = 'orders-loader/'
const Types = {
    SET_ORDER_LIST: prefix + 'SET_ORDER_LIST',
    SET_CARRYING_LIST: prefix + 'SET_CARRYING_LIST',
    SET_SELECTED_ORDER_ID: prefix + 'SET_SELECTED_ORDER_ID',
    SET_SELECT_CARRYING_ITEM_ID: prefix + 'SET_SELECT_CARRYING_ITEM_ID',
    SET_SELECTED_CARRYING_ORDER_ID: prefix + 'SET_SELECTED_CARRYING_ORDER_ID',
}

const setOrderList = orderList => ({
    payload: { orderList },
    type: Types.SET_ORDER_LIST,
})

const setCarryingOrderList = carryingList => ({
    payload: { carryingList },
    type: Types.SET_CARRYING_LIST,
})

const setSelectedOrderId = selectedOrderId => ({
    payload: { selectedOrderId },
    type: Types.SET_SELECTED_ORDER_ID,
})

const setSelectCarryingItemId = selectCarryingItemId => ({
    payload: { selectCarryingItemId },
    type: Types.SET_SELECT_CARRYING_ITEM_ID,
})

const setSelectedCarryingOrderId = selectedCarryingOrderId => ({
    payload: { selectedCarryingOrderId },
    type: Types.SET_SELECTED_CARRYING_ORDER_ID,
})

const setAmountDelivered = ({ carryItemId, itemId, amountDelivered }) => (
    dispatch,
    getState,
) => {
    const { carryingList } = getState().ordersLoader

    const newCarryingList = carryingList.map(carryItem =>
        carryItem.id === carryItemId
            ? {
                  ...carryItem,
                  products: carryItem.products.map(product =>
                      product.id === itemId
                          ? { ...product, amountDelivered: amountDelivered }
                          : product,
                  ),
              }
            : carryItem,
    )

    dispatch({
        payload: { carryingList: newCarryingList },
        type: Types.SET_CARRYING_LIST,
    })
}

const loadOrders = () => async dispatch => {
    const { data, success } = await HttpService.get('order/loader')
    if (success) {
        if (!data) {
            await dispatch(setOrderList([]))
            return
        }

        const mappedData = data.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
            releasedAt: new Date(item.releasedAt),
            completedAt: new Date(item.completedAt),
        }))
        const orderedData = mappedData.sort((a, b) => {
            return sort(a, b)
        })
        const mergedData = MergedProductsService.ordersMergeSimilarProducts(
            orderedData,
        )
        await dispatch(setOrderList(mergedData))
    }

    return success
}

const loadCarryingOrders = () => async (dispatch, getState) => {
    const { data, success } = await HttpService.get('carry')
    // Because the partial state of the carry array will be stored locally, we
    // need to filter the array for items that have been loaded already
    if (success) {
        if (!data) {
            await dispatch(setCarryingOrderList([]))
            return
        }

        const { carryingList } = getState().ordersLoader

        // Add non existent ones AND edited ones
        const filteredData = data.filter(item => {
            if (!carryingList.some(x => x.id === item.id)) {
                return true
            } else {
                const order = carryingList.find(o => o.id === item.id)
                for (let i = 0; i < order.products.length; i++) {
                    const product = order.products[i]
                    const orderProduct = item.products.filter(
                        x =>
                            x.productId === product.productId &&
                            x.productTypeId === product.productTypeId,
                    )
                    const orderProductAmount = orderProduct.reduce(
                        (prev, cur) => (prev += cur.amount),
                        0,
                    )
                    if (orderProductAmount !== product.amount) {
                        return true
                    }
                }
                return false
            }
        })

        const mappedData = filteredData.map(item => ({
            ...item,
            products: item.products.map(product => ({
                ...product,
                amountDelivered: product.amount,
            })),
            createdAt: new Date(item.createdAt),
            releasedAt: new Date(item.releasedAt),
        }))

        if (mappedData?.length > 0) {
            const orderedData = mappedData.sort((a, b) => {
                return sort(a, b)
            })
            const mergedData = MergedProductsService.ordersMergeSimilarProducts(
                orderedData,
            )
            const mergedWithDelivered = mergedData.map(item => ({
                ...item,
                products: item.products.map(product => ({
                    ...product,
                    amountDelivered: product.amount,
                })),
            }))
            await dispatch(
                setCarryingOrderList([
                    ...carryingList.filter(
                        item =>
                            !mergedWithDelivered.some(x => x.id === item.id),
                    ), // filter the ones that already are on merged
                    ...mergedWithDelivered,
                ]),
            )
            if (mergedWithDelivered?.length > 0) {
                await dispatch(
                    setSelectCarryingItemId(
                        mergedWithDelivered[mergedWithDelivered.length - 1].id,
                    ),
                )
            }
        }
    }

    return success
}

const startCarrying = id => async () => {
    const { data, success } = await HttpService.post('carry/start', { id })

    return success
}

const finishCarrying = ({ orderId, products }) => async (
    dispatch,
    getState,
) => {
    const { success } = await HttpService.post('carry/finish', {
        orderId,
        products,
    })

    if (success) {
        const { carryingList } = getState().ordersLoader

        // Delete from list
        const filteredData = carryingList.filter(item => item.id !== orderId)
        await dispatch(setCarryingOrderList(filteredData))
    }

    return success
}

const initialState = {
    orderList: [],
    carryingList: [],
    selectedOrderId: 0,
    selectCarryingItemId: 0,
    selectedCarryingOrderId: 0,
}

export const Creators = {
    loadOrders,
    startCarrying,
    finishCarrying,
    setAmountDelivered,
    setSelectedOrderId,
    loadCarryingOrders,
    setSelectedCarryingOrderId,
}

export { Selectors } from './selectors'

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.SET_ORDER_LIST:
            return {
                ...state,
                orderList: action.payload.orderList,
            }
        case Types.SET_CARRYING_LIST:
            return {
                ...state,
                carryingList: action.payload.carryingList,
            }
        case Types.SET_SELECTED_ORDER_ID:
            return {
                ...state,
                selectedOrderId: action.payload.selectedOrderId,
            }
        case Types.SET_SELECT_CARRYING_ITEM_ID:
            return {
                ...state,
                selectCarryingItemId: action.payload.selectCarryingItemId,
            }
        case Types.SET_SELECTED_CARRYING_ORDER_ID:
            return {
                ...state,
                selectedCarryingOrderId: action.payload.selectedCarryingOrderId,
            }
        default:
            return state
    }
}
