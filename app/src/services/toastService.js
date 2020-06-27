const initialize = toastRef => {
	ToastService.toastRef = toastRef
}

const defaultDuration = 2000
const show = ({ message, duration = defaultDuration }) => {
	clearTimeout(ToastService.toastRef.current.timer)
	ToastService.toastRef.current.show(message, duration)
}

const ToastService = {
	show,
	initialize,
	toastRef: null,
}

export default ToastService
