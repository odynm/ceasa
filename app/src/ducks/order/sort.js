import orderStatus from 'src/enums/order'

const sort = (a, b) => {
	const getIndex = item => {
		return item.status === orderStatus.carrying && item.urgent
			? 1
			: item.status === orderStatus.carrying
			? 2
			: !(item.status === orderStatus.done) && item.urgent
			? 3
			: item.status === orderStatus.released
			? 4
			: item.status === orderStatus.blocked
			? 5
			: item.status === orderStatus.done
			? 6
			: 7
	}

	const aIndex = getIndex(a)
	const bIndex = getIndex(b)
	const indexResult = aIndex - bIndex

	return indexResult === 0 ? a.releasedAt - b.releasedAt : indexResult
}

export default sort
