import HttpService from 'src/services/httpService'

const add = item => async dispatch => {
	const mappedItem = {
		product: item.selectedProductId,
		productType: item.selectedTypeId,
		description: item.additionalDescription,
		amount: item.quantity,
	}
	const { data, success } = await HttpService.post('storage', mappedItem)
}

export const Creators = {
	add,
}
