const tasks = []

const addFunction = (func, conditions) => {
	tasks.push(func)
}

const start = () => {
	//setInterval(refresh, 10000)
}

const refresh = () => {
	for (let i = 0; i < tasks.length; i++) {
		tasks[i]()
	}
}

const RefresherService = {
	start,
	addFunction,
}

export default RefresherService
