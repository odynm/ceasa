import HttpService from 'src/services/httpService'

const prefix = 'user/'
const Types = {
	SET_PRODUCTS: prefix + 'SET_PRODUCTS',
}

const setProducts = products => ({
	payload: products,
	type: Types.SET_PRODUCTS,
})

const loadProducts = () => async dispatch => {
	const { data, success } = await HttpService.get('product/all')
	if (success) {
		//data.types.unshift({ id: 0, name: 'Qualquer' })
		await dispatch(setProducts(data))
	}

	return success
}

const initialState = {
	products: [],
	recentProducts: [],
	productTypes: [],
	recentProductTypes: [],
}

export const Creators = {
	loadProducts,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.SET_PRODUCTS:
			return {
				...state,
				products: action.payload.products,
				productTypes: action.payload.types,
			}
		default:
			return state
	}
}
