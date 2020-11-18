let subs = []

const subscribeHide = func => {
	subs = subs.filter(x => x)
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
