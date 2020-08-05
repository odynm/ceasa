import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as OrderCreators } from 'src/ducks/order'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/order/validations/create'
import SellComponent from './component'
import MoneyService from 'src/services/moneyService'
import ToastService from 'src/services/toastService'
import ScreenHeader from 'src/components/fw/screen-header'

const Sell = ({
	client,
	setClient,
	sendOrder,
	resetOrder,
	orderItems,
	getStorage,
	loadProducts,
	addOrderItem,
	generateLoad,
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
	const [clientStep, setClientStep] = useState(false)

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
		setClientStep(false)
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
			setClient={setClient}
			addProduct={addProduct}
			totalPrice={totalPrice}
			orderItems={orderItems}
			clientStep={clientStep}
			openAddMenu={openAddMenu}
			handlePress={handlePress}
			handleClear={handleClear}
			generateLoad={generateLoad}
			setOpenAddMenu={setOpenAddMenu}
			setGenerateLoad={setGenerateLoad}
			storedItemsOrderAware={storedItemsOrderAware}
		/>
	)
}

Sell.navigationOptions = () => ({
	title: translate('menus.sell'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	getStorage: StorageCreators.get,
	setClient: OrderCreators.setClient,
	sendOrder: OrderCreators.sendOrder,
	resetOrder: OrderCreators.resetOrder,
	addOrderItem: OrderCreators.addOrderItem,
	loadProducts: ProductCreators.loadProducts,
	setGenerateLoad: OrderCreators.setGenerateLoad,
	resetStorageOrder: StorageCreators.resetStorageOrder,
	decreaseItemsOrder: StorageCreators.decreaseItemsOrder,
}

const mapStateToProps = ({ products, storage, order }) => ({
	client: order.client,
	orderItems: order.orderItems,
	generateLoad: order.generateLoad,
	storedItemsOrderAware: storage.storedItemsOrderAware,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
