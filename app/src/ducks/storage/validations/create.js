const validateCreate = (data, setErrors) => {
	let errors = {}

	if (data.selectedProductId <= 0) {
		errors = { ...errors, selectedProductId: 'ERRO' }
	}

	setErrors(errors)
	return Object.keys(errors).length === 0
}

export { validateCreate }
