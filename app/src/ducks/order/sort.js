import orderStatus from 'src/enums/order'

const sort = (a, b) => {
	const getIndex = status => {
		return status === orderStatus.carrying
			? 1
			: status === orderStatus.urgent
			? 2
			: status === orderStatus.released
			? 3
			: status === orderStatus.blocked
			? 4
			: status === orderStatus.done
			? 5
			: 6
	}

	const aIndex = getIndex(a.status)
	const bIndex = getIndex(b.status)
	const indexResult = aIndex - bIndex

	return indexResult === 0 ? a.releasedAt - b.releasedAt : indexResult
}

export default sort
