const subs = []

const subscribeHide = func => {
	subs.push(func)
}

const keyboardHide = () => {
	subs.forEach(f => f())
}

const KeyboardService = {
	keyboardHide,
	subscribeHide,
}

export default KeyboardService
