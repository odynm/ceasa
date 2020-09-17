let started = false
const tasks = []

const addFunction = (func, conditions) => {
	tasks.push({ func, conditions })
}

const start = () => {
	if (!started) {
		started = true
		setInterval(refresh, 10000)
	}
}

const refresh = () => {
	for (let i = 0; i < tasks.length; i++) {
		let ok = true
		for (let j = 0; j < tasks[i].conditions.length; i++) {
			ok = tasks[i].conditions[j]()
		}
		if (ok) {
			tasks[i]()
		}
	}
}

const RefresherService = {
	start,
	addFunction,
}

export default RefresherService
