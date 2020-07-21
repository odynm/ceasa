import { translate } from 'src/i18n/translate'

const initialize = toastRef => {
	ToastService.toastRef = toastRef
}

const defaultDuration = 2000
const show = ({ message, duration = defaultDuration }) => {
	clearTimeout(ToastService.toastRef.current.timer)
	ToastService.toastRef.current.show(message, duration)
}

const serverError = () => {
	show({ message: translate('errors.serverError') })
}

const ToastService = {
	show,
	initialize,
	serverError,
	toastRef: null,
}

export default ToastService
