import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as OrderCreators } from 'src/ducks/order'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { Selectors as StorageSelectors } from 'src/ducks/storage'
import { validateCreate } from 'src/ducks/order/validations/create'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import SellComponent from './component'
import orderStatus from 'src/enums/order'
import SellHeader from './components/header'
import MoneyService from 'src/services/moneyService'
import ToastService from 'src/services/toastService'

const Sell = ({
	client,
	status,
	setStatus,
	clientStep,
	setClient,
	sendOrder,
	resetOrder,
	orderItems,
	getStorage,
	loadOrders,
	loadProducts,
	addOrderItem,
	generateLoad,
	storageItems,
	setItemsOrder,
	setClientStep,
	removeOrderItem,
	setGenerateLoad,
	resetStorageOrder,
	decreaseItemsOrder,
	increaseItemsOrder,
	storedItemsOrderAware,
}) => {
	const [working, setWorking] = useState(false)
	const [errors, setErrors] = useState({})
	const [totalPrice, setTotalPrice] = useState({
		text: '0,00',
		value: 0.0,
	})
	const [openAddMenu, setOpenAddMenu] = useState(false)

	useEffect(() => {
		loadProducts()
		getStorage()
	}, [])

	useEffect(() => {
		updatePrice()
	}, [orderItems])

	const updatePrice = () => {
		setTotalPrice(
			orderItems.reduce((prev, cur) => MoneyService.add(prev, cur.total), {
				text: '0,00',
				value: 0.0,
			}),
		)
	}

	const addProduct = async product => {
		await addOrderItem(product)
		decreaseItemsOrder({ id: product.id, amount: product.storageAmount })
	}

	const editProduct = async product => {
		// The add already has an edit built-in
		await addOrderItem(product)

		const available = StorageSelectors.getAvailable({
			storageItems: storageItems,
			id: product.id,
		})
		const difference = available - product.storageAmount
		setItemsOrder({ id: product.id, amount: difference })
		updatePrice()
	}

	const removeProduct = async product => {
		await removeOrderItem(product)
		increaseItemsOrder({ id: product.id, amount: product.storageAmount })
	}

	const handleClear = () => {
		setOpenAddMenu(false)
		setTotalPrice({
			text: '0,00',
			value: 0.0,
		})
		resetOrder()
		resetStorageOrder()
	}

	const setReleasedStatus = checked => {
		if (checked) {
			setStatus(orderStatus.released)
		} else {
			setStatus(orderStatus.blocked)
		}
	}

	const handlePress = async () => {
		if (clientStep) {
			if (validateCreate(client, setErrors)) {
				setWorking(true)
				const success = await sendOrder()
				if (success) {
					ToastService.show({ message: translate('sell.added') })
				}
				handleClear()
				setWorking(false)
				await getStorage()
				await loadOrders()
			}
		} else {
			if (orderItems && orderItems.length > 0) {
				setClientStep(true)
			} else {
				ToastService.show({ message: translate('sell.errors.noItems') })
			}
		}
	}

	return (
		<SellComponent
			status={status}
			client={client}
			errors={errors}
			working={working}
			setClient={setClient}
			addProduct={addProduct}
			totalPrice={totalPrice}
			orderItems={orderItems}
			clientStep={clientStep}
			editProduct={editProduct}
			openAddMenu={openAddMenu}
			handlePress={handlePress}
			handleClear={handleClear}
			storageItems={storageItems}
			generateLoad={generateLoad}
			removeProduct={removeProduct}
			setOpenAddMenu={setOpenAddMenu}
			setGenerateLoad={setGenerateLoad}
			setReleasedStatus={setReleasedStatus}
			storedItemsOrderAware={storedItemsOrderAware}
		/>
	)
}

Sell.navigationOptions = () => ({
	title: translate('menus.sell'),
	headerLeft: props => <SellHeader {...props} />,
})

const mapStateToProps = ({ storage, order }) => ({
	client: order.client,
	status: order.status,
	clientStep: order.clientStep,
	orderItems: order.orderItems,
	generateLoad: order.generateLoad,
	storageItems: storage.storedItems,
	storedItemsOrderAware: storage.storedItemsOrderAware,
})

const mapDispatchToProps = {
	getStorage: StorageCreators.get,
	setStatus: OrderCreators.setStatus,
	setClient: OrderCreators.setClient,
	sendOrder: OrderCreators.sendOrder,
	resetOrder: OrderCreators.resetOrder,
	addOrderItem: OrderCreators.addOrderItem,
	loadProducts: ProductCreators.loadProducts,
	setClientStep: OrderCreators.setClientStep,
	loadOrders: OrdersVendorCreators.loadOrders,
	setItemsOrder: StorageCreators.setItemsOrder,
	removeOrderItem: OrderCreators.removeOrderItem,
	setGenerateLoad: OrderCreators.setGenerateLoad,
	resetStorageOrder: StorageCreators.resetStorageOrder,
	decreaseItemsOrder: StorageCreators.decreaseItemsOrder,
	increaseItemsOrder: StorageCreators.increaseItemsOrder,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
