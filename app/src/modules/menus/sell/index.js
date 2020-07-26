import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { View, TouchableOpacity, ScrollView, CheckBox } from 'react-native'
import styles from './styles'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import ItemCard from './components/item-card'
import Button from 'src/components/fw/button'
import AddProduct from './components/add-product'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const Sell = ({ getStorage, storedItems, loadProducts }) => {
	const [errors, setErrors] = useState({})
	const [totalPrice, setTotalPrice] = useState(0)

	const [openAddMenu, setOpenAddMenu] = useState(false)

	useEffect(() => {
		loadProducts()
		getStorage()
	}, [])

	const addProduct = id => {
		console.warn(id)
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<Button label={translate('sell.restart')} />
			<ScrollView>
				<ItemCard />
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
						text={totalPrice}
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
					<CheckBox style={styles.checkbox} />
				</View>
				<Space size2 />
				<Button label={translate('sell.continue')} />
			</View>
			<AddProduct
				open={openAddMenu}
				items={storedItems}
				addProduct={addProduct}
				setOpen={setOpenAddMenu}
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
	loadProducts: ProductCreators.loadProducts,
}

const mapStateToProps = ({ products, storage }) => ({
	storedItems: storage.storedItems,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
