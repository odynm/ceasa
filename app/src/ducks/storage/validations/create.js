import {translate} from 'src/i18n/translate'

const validateCreate = (data, setErrors) => {
    let errors = {}

    if (data.productId <= 0) {
        errors = {
            ...errors,
            productId: translate('storage.errors.noProduct'),
        }
    }

    setErrors(errors)
    return Object.keys(errors).length === 0
}

export {validateCreate}
