import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as OrderCreators } from 'src/ducks/order'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/order/validations/create'
import SellComponent from './component'
import SellHeader from './components/header'
import MoneyService from 'src/services/moneyService'
import ToastService from 'src/services/toastService'

const Sell = ({
	client,
	released,
	clientStep,
	setClient,
	sendOrder,
	resetOrder,
	orderItems,
	getStorage,
	setReleased,
	loadProducts,
	addOrderItem,
	generateLoad,
	setClientStep,
	setGenerateLoad,
	resetStorageOrder,
	decreaseItemsOrder,
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
		setTotalPrice(
			orderItems.reduce((prev, cur) => MoneyService.add(prev, cur.total), {
				text: '0,00',
				value: 0.0,
			}),
		)
	}, [orderItems])

	const addProduct = product => {
		addOrderItem(product)
		decreaseItemsOrder({ id: product.id, amount: product.amount })
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
			client={client}
			errors={errors}
			working={working}
			released={released}
			setClient={setClient}
			addProduct={addProduct}
			totalPrice={totalPrice}
			orderItems={orderItems}
			clientStep={clientStep}
			openAddMenu={openAddMenu}
			handlePress={handlePress}
			handleClear={handleClear}
			setReleased={setReleased}
			generateLoad={generateLoad}
			setOpenAddMenu={setOpenAddMenu}
			setGenerateLoad={setGenerateLoad}
			storedItemsOrderAware={storedItemsOrderAware}
		/>
	)
}

Sell.navigationOptions = () => ({
	title: translate('menus.sell'),
	headerLeft: props => <SellHeader {...props} />,
})

const mapDispatchToProps = {
	getStorage: StorageCreators.get,
	setClient: OrderCreators.setClient,
	sendOrder: OrderCreators.sendOrder,
	resetOrder: OrderCreators.resetOrder,
	setReleased: OrderCreators.setReleased,
	addOrderItem: OrderCreators.addOrderItem,
	loadProducts: ProductCreators.loadProducts,
	setClientStep: OrderCreators.setClientStep,
	setGenerateLoad: OrderCreators.setGenerateLoad,
	resetStorageOrder: StorageCreators.resetStorageOrder,
	decreaseItemsOrder: StorageCreators.decreaseItemsOrder,
}

const mapStateToProps = ({ storage, order }) => ({
	client: order.client,
	released: order.released,
	clientStep: order.clientStep,
	orderItems: order.orderItems,
	generateLoad: order.generateLoad,
	storedItemsOrderAware: storage.storedItemsOrderAware,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
