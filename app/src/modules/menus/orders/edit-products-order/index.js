import React, { useState, useEffect } from 'react'
import { hp } from 'src/utils/screen'
import { connect } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import AddProduct from 'src/components/ceasa/sell/add-product'
import TotalSegment from 'src/components/ceasa/sell/total-segment'
import ProductListSegment from 'src/components/ceasa/sell/product-list-segment'

const EditProductsOrder = ({
	orderItems,
	addOrderItem,
	decreaseItemsOrder,
	storedItemsOrderAware,
	setProductListIsDirty,
}) => {
	const [totalPrice, setTotalPrice] = useState({
		text: '0,00',
		value: 0.0,
	})
	const [openAddMenu, setOpenAddMenu] = useState(false)

	useEffect(() => {
		setTotalPrice(
			orderItems.reduce((prev, cur) => MoneyService.add(prev, cur.total), {
				text: '0,00',
				value: 0.0,
			}),
		)
	}, [orderItems])

	const addProduct = product => {
		setProductListIsDirty(true)
		addOrderItem(product)
		decreaseItemsOrder({ id: product.id, amount: product.amount })
	}

	const editProduct = product => {
		setProductListIsDirty(true)
		addOrderItem(product)
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<ProductListSegment
				style={styles.items}
				orderItems={orderItems}
				editProduct={editProduct}
				storageItems={storedItemsOrderAware}
			/>
			<View style={styles.footer}>
				<TotalSegment
					totalPrice={totalPrice}
					setOpenAddMenu={setOpenAddMenu}
				/>
			</View>
			<AddProduct
				open={openAddMenu}
				addProduct={addProduct}
				setOpen={setOpenAddMenu}
				storageItems={storedItemsOrderAware}
			/>
		</ScreenBase>
	)
}
EditProductsOrder.navigationOptions = () => ({
	title: translate('menus.editProductsOrder'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({ storage, editOrder }) => ({
	orderItems: editOrder.orderItems,
	storedItemsOrderAware: storage.storedItemsOrderAware,
})

const mapDispatchToProps = {
	addOrderItem: EditOrderCreators.addOrderItem,
	decreaseItemsOrder: StorageCreators.decreaseItemsOrder,
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
