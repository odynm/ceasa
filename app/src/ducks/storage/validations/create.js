import { translate } from 'src/i18n/translate'

const validateCreate = (data, setErrors) => {
	let errors = {}

	if (data.selectedProductId <= 0) {
		errors = {
			...errors,
			selectedProductId: translate('storage.errors.noProduct'),
		}
	}

	setErrors(errors)
	return Object.keys(errors).length === 0
}

export { validateCreate }
