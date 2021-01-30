import React, { useState, useEffect } from 'react'
import { hp } from 'src/utils/screen'
import { connect } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import orderStatus from 'src/enums/order'
import MoneyService from 'src/services/moneyService'
import ToastService from 'src/services/toastService'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import AddProduct from 'src/components/ceasa/sell/add-product'
import TotalSegment from 'src/components/ceasa/sell/total-segment'
import ProductListSegment from 'src/components/ceasa/sell/product-list-segment'

const EditProductsOrder = ({
	navigation,
	orderItems,
	storedItems,
	noConnection,
	addOrderItem,
	removeOrderItem,
	setProductListIsDirty,
}) => {
	const [cantEdit, setCantEdit] = useState(false)
	const [totalPrice, setTotalPrice] = useState({
		text: '0,00',
		value: 0.0,
	})
	const [openAddMenu, setOpenAddMenu] = useState(false)
	// The state of the order at the start of edition
	const [currentOrderSnapshot, setCurrentOrderSnapshot] = useState([])
	const [storedItemsEditNormalized, setStoredItemsEditNormalized] = useState(
		[],
	)

	useEffect(() => {
		if (navigation.state?.params?.status) {
			const status = navigation.state.params.status
			if (status === orderStatus.deleted || status === orderStatus.done) {
				setCantEdit(true)
			} else {
				setCantEdit(false)
			}
		} else {
			setCantEdit(false)
		}

		if (navigation.state?.params?.currentOrderSnapshot) {
			setCurrentOrderSnapshot(navigation.state.params.currentOrderSnapshot)
		}

		updateNormalizedStorage()
	}, [])

	useEffect(() => {
		updatePrice()
	}, [orderItems])

	useEffect(() => {
		updateNormalizedStorage()
	}, [storedItems])

	const updateNormalizedStorage = () => {
		// We will use the order state at the start of the editing (currentOrderSnapshot)
		if (storedItems && storedItems.length > 0) {
			const normalized = storedItems.map(x => ({
				...x,
				amount:
					x.amount +
						// I can't use storageId because it can be any of the many storage ids
						// when the item is merged, so we use productId, productTypeId and descriptionId
						currentOrderSnapshot.find(
							oi =>
								oi.productId === x.productId &&
								oi.productTypeId === x.productTypeId &&
								oi.descriptionId === x.descriptionId,
						)?.storageAmount || 0,
			}))

			setStoredItemsEditNormalized(normalized)
		}
	}

	const updatePrice = () => {
		setTotalPrice(
			orderItems.reduce((prev, cur) => MoneyService.add(prev, cur.total), {
				text: '0,00',
				value: 0.0,
			}),
		)
	}

	const handleOpenAddMenu = () => {
		if (noConnection) {
			ToastService.show({ message: translate('app.noConnectionError') })
		} else if (cantEdit) {
			ToastService.show({
				message: translate('orders.errors.cantEditAnymore'),
			})
		} else {
			setOpenAddMenu(true)
		}
	}

	const addProduct = product => {
		setProductListIsDirty(true)
		addOrderItem(product)
	}

	const editProduct = product => {
		setProductListIsDirty(true)
		addOrderItem(product)
		updatePrice()
		updateNormalizedStorage()
	}

	const removeProduct = async product => {
		await removeOrderItem(product)
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<ProductListSegment
				editMode
				cantEdit={cantEdit}
				style={styles.items}
				editProduct={editProduct}
				orderItems={orderItems}
				removeProduct={removeProduct}
				storageItems={storedItemsEditNormalized}
			/>
			<View style={styles.footer}>
				<TotalSegment
					totalPrice={totalPrice}
					setOpenAddMenu={handleOpenAddMenu}
				/>
			</View>
			<AddProduct
				open={openAddMenu}
				addProduct={addProduct}
				setOpen={setOpenAddMenu}
				storageItems={storedItems}
				removeProduct={removeProduct}
				alreadyAddedProducts={orderItems}
			/>
		</ScreenBase>
	)
}
EditProductsOrder.navigationOptions = () => ({
	title: translate('menus.editProductsOrder'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({ app, storage, editOrder }) => ({
	noConnection: app.noConnection,
	orderItems: editOrder.orderItems,
	storedItems: storage.storedItems,
})

const mapDispatchToProps = {
	addOrderItem: EditOrderCreators.addOrderItem,
	removeOrderItem: EditOrderCreators.removeOrderItem,
	setProductListIsDirty: EditOrderCreators.setProductListIsDirty,
}

const styles = StyleSheet.create({
	items: {
		marginTop: hp(10),
	},
	footer: {
		marginBottom: hp(50),
		marginTop: 'auto',
	},
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditProductsOrder))
