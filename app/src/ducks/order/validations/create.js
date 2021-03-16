import { translate } from 'src/i18n/translate'

const validateCreate = (client, generateLoad, setErrors) => {
	let errors = {}

	if (generateLoad && (!client.key || client.key === '')) {
		errors = {
			...errors,
			key: translate('sell.errors.insertClient'),
		}
	}

	setErrors(errors)
	return Object.keys(errors).length === 0
}

export { validateCreate }
