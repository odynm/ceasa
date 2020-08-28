export const toHour = date => {
	const hour = date.getHours()
	const minutes = date.getMinutes()

	const hh = hour < 10 ? '0' + hour : hour
	const mm = minutes < 10 ? '0' + minutes : minutes
	return hh + ':' + mm
}
