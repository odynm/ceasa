import HttpService from 'src/services/httpService'

const prefix = 'products/'
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
		const ordered = { products: [], types: [] }
		ordered.products = data.products.sort((a, b) =>
			a.name.localeCompare(b.name),
		)
		ordered.types = data.types.sort((a, b) => a.name.localeCompare(b.name))
		await dispatch(setProducts(ordered))
	}

	return success
}

const addNewProduct = name => async dispatch => {
	const { data, success } = await HttpService.post('product/add', { name })

	return success
}

const addNewType = (name, relatedProductId) => async dispatch => {
	const { data, success } = await HttpService.post('product/addType', {
		name: name,
		relatedProductId: relatedProductId,
	})

	return success
}

const initialState = {
	products: [],
	productTypes: [],
	//recentProducts: [],
	//recentProductTypes: [],
}

export const Creators = {
	addNewType,
	loadProducts,
	addNewProduct,
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
