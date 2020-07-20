import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/storage/validations/create'
import styles from './styles'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Quantity from 'src/components/fw/quantity'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import StoredItemCard from './components/stored-item-card'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'

const Register = ({
	products,
	storedItems,
	addStorage,
	getStorage,
	loadProducts,
	productTypes,
	recentProducts,
	recentProductTypes,
}) => {
	const [selectedProductId, setSelectedProductId] = useState(0)
	const [selectedTypeId, setSelectedTypeId] = useState(0)
	const [productTypesFiltered, setProductTypesFiltered] = useState([])
	const [additionalDescription, setAdditionalDescription] = useState('')
	const [quantity, setQuantity] = useState(1)
	const [errors, setErrors] = useState({})

	useEffect(() => {
		loadProducts()
		getStorage()
	}, [])

	useEffect(() => {
		setProductTypesFiltered(
			productTypes.filter(x => x.productId === selectedProductId),
		)
	}, [selectedProductId])

	const handleAdd = () => {
		const data = {
			selectedTypeId,
			selectedProductId,
			additionalDescription,
			quantity,
		}

		if (validateCreate(data, setErrors)) {
			addStorage(data)
			setSelectedProductId(0)
			setSelectedTypeId(0)
			setAdditionalDescription('')
			setQuantity(1)
		}
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<CloseKeyboardView>
				<RecentRegisterPicker
					errorMessage={errors.selectedProductId}
					list={products}
					listRecent={recentProducts}
					selectedId={selectedProductId}
					setSelectedId={setSelectedProductId}
					label={translate('register.product')}
					listLabel={translate('register.products')}
					loading={!products || products.length === 0}
					labelNotRegistered={translate(
						'register.registerNotListedProduct',
					)}
				/>
				<RecentRegisterPicker
					list={productTypesFiltered}
					listRecent={recentProductTypes}
					selectedId={selectedTypeId}
					setSelectedId={setSelectedTypeId}
					label={translate('register.productType')}
					listLabel={translate('register.productTypes')}
					loading={!productTypes || productTypes.length === 0}
					labelNotRegistered={translate(
						'register.registerNotListedProductType',
					)}
				/>
				<TextInput
					value={additionalDescription}
					setValue={setAdditionalDescription}
					label={translate('register.additionalDescription')}
				/>
				<Quantity
					value={quantity}
					setValue={setQuantity}
					label={translate('register.quantity')}
				/>
				<Space size2 />
				<Button onPress={handleAdd} label={translate('register.add')} />
			</CloseKeyboardView>
			<View style={styles.storedContainer}>
				<ScrollView
					showsVerticalScrollIndicator={true}
					style={styles.stored}>
					{storedItems.map((item, index) => {
						return (
							<StoredItemCard
								key={index}
								product={item.productName}
								productType={item.productTypeName}
								description={item.description}
								amount={item.amount}
							/>
						)
					})}
				</ScrollView>
			</View>
		</ScreenBase>
	)
}

Register.navigationOptions = () => ({
	title: translate('menus.register'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	addStorage: StorageCreators.add,
	getStorage: StorageCreators.get,
	loadProducts: ProductCreators.loadProducts,
}

const mapStateToProps = ({ products, storage }) => ({
	products: products.products,
	storedItems: storage.storedItems,
	productTypes: products.productTypes,
	recentProducts: products.recentProducts,
	recentProductTypes: products.recentProductTypes,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Register)
