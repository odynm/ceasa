const getAvailable = ({ storageItems, id }) => {
	if (!storageItems) return
	const storageItem = storageItems.find(item => item.id === id)
	if (storageItem) {
		return storageItem.amount ? storageItem.amount : 0
	}
	return 0
}

export const Selectors = {
	getAvailable,
}
