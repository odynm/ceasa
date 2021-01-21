import rfdc from 'rfdc'
import MoneyService from './moneyService'

const mergeSimilarItems = storageItems => {
	// storageItems is sorted, so we can relly only on the
	// ids for proper merge
	const mergedItems = []

	// only needed info
	const getItem = obj => {
		return {
			amount: obj.amount,
			storageAmount: obj.storageAmount, // sometimes is undefined
			id: obj.id,
			// This is clunky, but its correct because of the way we treat products:
			// * sometimes we use storedItems, which only have an "id" prop
			// * sometimes we use orderITems, which have an "storageId" prop
			storageId: obj.storageId ? obj.storageId : obj.id,
			costPrice: rfdc()(obj.costPrice), // to pass by value
		}
	}

	for (let i = 0; i < storageItems.length; i++) {
		const curAddedIndex = i
		const curProductId = storageItems[i].productId
		const curTypeId = storageItems[i].productTypeId
		const curDescriptionId = storageItems[i].descriptionId
		for (; i < storageItems.length; i++) {
			if (
				curProductId === storageItems[i].productId &&
				curTypeId === storageItems[i].productTypeId &&
				curDescriptionId === storageItems[i].descriptionId
			) {
				if (curAddedIndex === i) {
					mergedItems.push(storageItems[i])
				} else {
					const a = mergedItems[mergedItems.length - 1]
					const b = storageItems[i]

					mergedItems[mergedItems.length - 1] = {
						isMerged: true,
						...a,
						costPrice: undefined, // merged doesn't have
						amount: a.amount + b.amount,
						storageAmount: a.storageAmount + b.storageAmount, //not always used, but sometimes useful
						mergedData: {
							items: a.mergedData?.items
								? [...a.mergedData.items, getItem(b)]
								: [getItem(a), getItem(b)],
						},
					}
				}
			} else {
				i--
				break
			}
		}
	}

	return mergedItems
}

// Calculate the merged price of merged products on a selling order
const calculateMergedPrice = items => {
	const totalAmount = items.reduce((prev, cur) => prev + cur.amount, 0)
	const totalPrice = items.reduce(
		(prev, cur) => prev + cur.amount * cur.costPrice.value,
		0,
	)
	return MoneyService.toMoney(totalPrice / totalAmount)
}

const sortProducts = arr => {
	const sortedItems = arr.sort((a, b) => {
		const res = a.productName.localeCompare(b.productName)
		if (res === 0) {
			return a.productTypeName.localeCompare(b.productTypeName)
		} else {
			return res
		}
	})

	return sortedItems
}

// Because of how the ""'product name'|'product type'|'description'|'cost price'"" system works,
// we will make a merge of similar items (that are 100% equal) on insertion and on update.
const addAndMergeSimilar = (cur, item) => {
	const equalItemIndex = cur.findIndex(
		x =>
			!x.isMerged &&
			x.costPrice.value === item.costPrice.value &&
			x.productName === item.productName &&
			x.productTypeName === item.productTypeName &&
			x.description === item.description,
	)

	// Merge full
	if (equalItemIndex >= 0) {
		return {
			arr: cur.map((x, i) =>
				i === equalItemIndex
					? {
							...item,
							id: x.id,
							amount: x.amount + item.amount,
					  }
					: x.id !== item.id
					? x
					: undefined,
			),
			merged: true,
		}
	}
	// Try merge all but price (isMerged = true)
	else {
		const mergeItemIndex = cur.findIndex(
			x =>
				x.productName === item.productName &&
				x.productTypeName === item.productTypeName &&
				x.description === item.description,
		)
		if (mergeItemIndex >= 0) {
			return {
				arr: cur.map((x, i) =>
					i === mergeItemIndex
						? {
								...x,
								id: x.id,
								amount: x.amount + item.amount,
								isMerged: true,
								mergedData: {
									items: x.isMerged
										? [...x.mergedData.items, item]
										: [x, item],
								},
						  }
						: x.id !== item.id
						? x
						: undefined,
				),
				merged: true,
			}
		} else {
			return { merged: false }
		}
	}
}

// Merge similar products on loader list
const ordersMergeSimilarProducts = orders => {
	const mergedOrders = []
	for (let i = 0; i < orders.length; i++) {
		const order = orders[i]
		const products = orders[i].products
		const mergedProducts = mergeSimilarProducts(products)
		mergedOrders.push({ ...order, products: mergedProducts })
	}
	return mergedOrders
}

const mergeSimilarProducts = products => {
	const orderedProducts = sortProducts(products)
	const mergedProducts = mergeSimilarItems(orderedProducts)
	return mergedProducts
}

const MergedProductsService = {
	sortProducts,
	mergeSimilarItems,
	addAndMergeSimilar,
	calculateMergedPrice,
	mergeSimilarProducts,
	ordersMergeSimilarProducts,
}

export default MergedProductsService
