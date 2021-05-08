const getAvailable = ({storageItems, product}) => {
    if (!storageItems || !product) return
    const storageItem = storageItems.find(
        (item) =>
            item.productId === product.productId &&
            item.productTypeId === product.productTypeId &&
            item.descriptionId === product.descriptionId,
    )
    if (storageItem) {
        return storageItem.amount ? storageItem.amount : 0
    }
    return 0
}

export const Selectors = {
    getAvailable,
}
