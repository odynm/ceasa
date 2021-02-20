export const toHour = date => {
	const d = new Date(date) // dirty trick to ensure that any string is converted to date
	const hour = d.getHours()
	const minutes = d.getMinutes()

	const hh = hour < 10 ? '0' + hour : hour
	const mm = minutes < 10 ? '0' + minutes : minutes
	return hh + ':' + mm
}
