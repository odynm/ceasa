import { translate } from 'src/i18n/translate'

const validateCreate = (data, setErrors) => {
	let errors = {}

	if (!data.key || data.key === '') {
		errors = {
			...errors,
			key: translate('sell.errors.insertClient'),
		}
	}

	setErrors(errors)
	return Object.keys(errors).length === 0
}

export { validateCreate }
