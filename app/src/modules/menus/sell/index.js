import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as OrderCreators } from 'src/ducks/order'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import ItemCard from './components/item-card'
import Button from 'src/components/fw/button'
import AddProduct from './components/add-product'
import MoneyService from 'src/services/moneyService'
import CheckBox from '@react-native-community/checkbox'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const Sell = ({
	orderItems,
	getStorage,
	loadProducts,
	addOrderItem,
	decreaseItemsOrder,
	storedItemsOrderAware,
}) => {
	const [errors, setErrors] = useState({})
	const [generateLoad, setGenerateLoad] = useState(true)
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

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<Button label={translate('sell.restart')} />
			<ScrollView style={styles.items}>
				{orderItems.map((item, index) => (
					<ItemCard
						key={index}
						total={item.total}
						amount={item.amount}
						unitPrice={item.unitPrice}
						product={item.productName}
						description={item.description}
						productType={item.productTypeName}
					/>
				))}
			</ScrollView>
			<View style={styles.footer}>
				<View style={styles.row}>
					<KText
						bold
						fontSize={24}
						style={styles.rowAlignText}
						text={`${translate('sell.total')} `}
					/>
					<KText
						bold
						fontSize={24}
						style={styles.rowAlignText}
						text={`${MoneyService.getCurrency().text} ${totalPrice.text}`}
					/>
					<TouchableOpacity
						onPress={() => setOpenAddMenu(true)}
						style={styles.addButton}>
						<KText fontSize={24} text={'+'} />
					</TouchableOpacity>
				</View>
				<Space />
				<View style={styles.row}>
					<KText
						bold
						style={styles.rowAlignText}
						text={translate('sell.generateLoad')}
					/>
					<CheckBox
						value={generateLoad}
						style={styles.checkbox}
						onValueChange={checked => setGenerateLoad(checked)}
					/>
				</View>
				<Space size2 />
				<Button label={translate('sell.continue')} />
			</View>
			<AddProduct
				open={openAddMenu}
				addProduct={addProduct}
				setOpen={setOpenAddMenu}
				items={storedItemsOrderAware}
			/>
		</ScreenBase>
	)
}

Sell.navigationOptions = () => ({
	title: translate('menus.sell'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	getStorage: StorageCreators.get,
	addOrderItem: OrderCreators.addOrderItem,
	loadProducts: ProductCreators.loadProducts,
	decreaseItemsOrder: StorageCreators.decreaseItemsOrder,
}

const mapStateToProps = ({ products, storage, order }) => ({
	orderItems: order.orderItems,
	storedItemsOrderAware: storage.storedItemsOrderAware,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
