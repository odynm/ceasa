import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { jobTypes } from 'src/ducks/offline/jobTypes'
import { Creators as OrderCreators } from 'src/ducks/order'
import { Creators as ClientCreators } from 'src/ducks/client'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as OfflineCreators } from 'src/ducks/offline'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/order/validations/create'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import SellComponent from './component'
import orderStatus from 'src/enums/order'
import SellHeader from './components/header'
import MoneyService from 'src/services/moneyService'
import ToastService from 'src/services/toastService'
import InternetService from 'src/services/internetService'

const Sell = ({
	client,
	status,
	clients,
	setStatus,
	setClient,
	sendOrder,
	resetOrder,
	orderItems,
	getStorage,
	loadOrders,
	clientStep,
	addToQueue,
	loadClients,
	noConnection,
	loadProducts,
	addOrderItem,
	generateLoad,
	storageItems,
	setClientStep,
	setStoredItems,
	removeOrderItem,
	setGenerateLoad,
	orderCreationData,
	createOfflineOrder,
	decreaseOfflineStorageAmount,
}) => {
	const [working, setWorking] = useState(false)
	const [errors, setErrors] = useState({})
	const [totalPrice, setTotalPrice] = useState({
		text: '0,00',
		value: 0.0,
	})
	const [openAddMenu, setOpenAddMenu] = useState(false)
	// { productId, productTypeId, description, missingAmount }
	const [missingItems, setMissingItems] = useState([])

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
	}

	const editProduct = async product => {
		// The add already has an edit built-in
		await addOrderItem(product)

		// TODO maybe not needed
		// const available = StorageSelectors.getAvailable({
		// 	storageItems: storageItems,
		// 	product: product,
		// })
		// const difference = available - product.storageAmount
		//setItemsOrder({ id: product.id, amount: difference })
		updatePrice()
	}

	const removeProduct = async product => {
		await removeOrderItem(product)
	}

	const handleClear = () => {
		setOpenAddMenu(false)
		setTotalPrice({
			text: '0,00',
			value: 0.0,
		})
		resetOrder()
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
				// Ensure that we don't try to send if we are offline
				if (
					noConnection ||
					!(await InternetService.isInternetReachable())
				) {
					const offlineOrderId = new Date().getTime()

					const orderToCreate = { ...orderCreationData }
					orderToCreate.offlineId = offlineOrderId

					addToQueue(jobTypes.addOrder, orderToCreate)

					const offlineStorageRestoreData = []

					orderItems.forEach(async item => {
						offlineStorageRestoreData.push(
							await decreaseOfflineStorageAmount(
								item.productId,
								item.productTypeId,
								item.descriptionId,
								item.amount,
							),
						)
					})

					const offlineOrder = {
						offlineId: offlineOrderId,
						offlineData: { offlineStorageRestoreData },
						client: client,
						products: orderItems.map(item => ({
							...item,
							unitPrice: item.unitPrice.value * 100,
							productId: item.productId,
							productTypeId: item.productTypeId,
							descriptionId: item.descriptionId,
						})),
						status: status,
						createdAt: new Date(),
					}
					createOfflineOrder(offlineOrder)

					handleClear()
					ToastService.show({ message: translate('sell.addedOffline') })
					setWorking(false)
				} else {
					const { success, data } = await sendOrder()
					if (success) {
						ToastService.show({ message: translate('sell.added') })
					} else {
						setMissingItems(data.data)
						setClientStep(false)
						setWorking(false)
						return
					}
					handleClear()
					setWorking(false)
					await getStorage()
					await loadOrders()
				}
			}
		} else {
			if (orderItems && orderItems.length > 0) {
				// This may be already too late to load them
				loadClients()
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
			clients={clients}
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
			missingItems={missingItems}
			storageItems={storageItems}
			generateLoad={generateLoad}
			removeProduct={removeProduct}
			setOpenAddMenu={setOpenAddMenu}
			setMissingItems={setMissingItems}
			setGenerateLoad={setGenerateLoad}
			setReleasedStatus={setReleasedStatus}
		/>
	)
}

Sell.navigationOptions = () => ({
	title: translate('menus.sell'),
	headerLeft: props => <SellHeader {...props} />,
})

const mapStateToProps = ({ app, storage, client, order }) => ({
	client: order.client,
	status: order.status,
	clients: client.clients,
	clientStep: order.clientStep,
	orderItems: order.orderItems,
	noConnection: app.noConnection,
	generateLoad: order.generateLoad,
	storageItems: storage.storedItems,
	orderCreationData: order,
})

const mapDispatchToProps = {
	getStorage: StorageCreators.get,
	setStatus: OrderCreators.setStatus,
	setClient: OrderCreators.setClient,
	sendOrder: OrderCreators.sendOrder,
	resetOrder: OrderCreators.resetOrder,
	addToQueue: OfflineCreators.addToQueue,
	loadClients: ClientCreators.loadClients,
	addOrderItem: OrderCreators.addOrderItem,
	loadProducts: ProductCreators.loadProducts,
	setClientStep: OrderCreators.setClientStep,
	loadOrders: OrdersVendorCreators.loadOrders,
	setStoredItems: StorageCreators.setStoredItems,
	removeOrderItem: OrderCreators.removeOrderItem,
	setGenerateLoad: OrderCreators.setGenerateLoad,
	createOfflineOrder: OrdersVendorCreators.createOfflineOrder,
	decreaseOfflineStorageAmount: StorageCreators.decreaseOfflineStorageAmount,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
