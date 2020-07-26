import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/storage/validations/create'
import styles from './styles'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Loader from 'src/components/fw/loader'
import Amount from 'src/components/fw/amount'
import ToastService from 'src/services/toastService'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import StoredItemCard from 'src/components/ceasa/stored-item-card'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'

const Storage = ({
	working,
	products,
	setWorking,
	addStorage,
	getStorage,
	storedItems,
	loadProducts,
	productTypes,
	recentProducts,
	recentProductTypes,
}) => {
	const [selectedProductId, setSelectedProductId] = useState(0)
	const [selectedTypeId, setSelectedTypeId] = useState(0)
	const [productTypesFiltered, setProductTypesFiltered] = useState([])
	const [additionalDescription, setAdditionalDescription] = useState('')
	const [amount, setAmount] = useState(1)
	const [errors, setErrors] = useState({})

	const scrollViewRef = useRef()

	useEffect(() => {
		loadProducts()
		getStorage()
	}, [])

	useEffect(() => {
		setProductTypesFiltered(
			productTypes.filter(x => x.productId === selectedProductId),
		)
	}, [selectedProductId])

	const handleAdd = async () => {
		const data = {
			selectedTypeId,
			selectedProductId,
			additionalDescription,
			amount,
		}

		if (validateCreate(data, setErrors)) {
			setWorking(true)
			const success = await addStorage(data)
			if (success) {
				setSelectedProductId(0)
				setSelectedTypeId(0)
				setAdditionalDescription('')
				setAmount(1)
				scrollViewRef.current.scrollToEnd()
			} else {
				ToastService.serverError()
			}
			setWorking(false)
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
					label={translate('storage.product')}
					listLabel={translate('storage.products')}
					loading={!products || products.length === 0}
					labelNotRegistered={translate(
						'storage.registerNotListedProduct',
					)}
				/>
				<RecentRegisterPicker
					list={productTypesFiltered}
					listRecent={recentProductTypes}
					selectedId={selectedTypeId}
					setSelectedId={setSelectedTypeId}
					label={translate('storage.productType')}
					listLabel={translate('storage.productTypes')}
					loading={!productTypes || productTypes.length === 0}
					labelNotRegistered={translate(
						'storage.registerNotListedProductType',
					)}
				/>
				<TextInput
					value={additionalDescription}
					setValue={setAdditionalDescription}
					label={translate('storage.additionalDescription')}
				/>
				<Amount
					value={amount}
					setValue={setAmount}
					label={translate('storage.amount')}
				/>
				<Space size2 />
				{working ? (
					<Loader />
				) : (
					<Button onPress={handleAdd} label={translate('storage.add')} />
				)}
			</CloseKeyboardView>
			<View style={styles.storedContainer}>
				<ScrollView
					ref={scrollViewRef}
					persistentScrollbar={true}
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

Storage.navigationOptions = () => ({
	title: translate('menus.storage'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	addStorage: StorageCreators.add,
	getStorage: StorageCreators.get,
	setWorking: StorageCreators.setWorking,
	loadProducts: ProductCreators.loadProducts,
}

const mapStateToProps = ({ products, storage }) => ({
	working: storage.working,
	products: products.products,
	storedItems: storage.storedItems,
	productTypes: products.productTypes,
	recentProducts: products.recentProducts,
	recentProductTypes: products.recentProductTypes,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Storage)
