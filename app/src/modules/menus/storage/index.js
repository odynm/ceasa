import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/storage/validations/create'
import { Creators as EditStorageCreators } from 'src/ducks/storage/edit-storage'
import styles from './styles'
import screens from 'src/constants/screens'
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
	orderItems,
	navigation,
	setWorking,
	addStorage,
	getStorage,
	storedItems,
	loadProducts,
	productTypes,
	recentProducts,
	recentProductTypes,
	setStorageItemEdit,
}) => {
	const [productId, setProductId] = useState(0)
	const [productTypeId, setProductTypeId] = useState(0)
	const [productTypesFiltered, setProductTypesFiltered] = useState([])
	const [description, setDescription] = useState('')
	const [amount, setAmount] = useState(1)
	const [errors, setErrors] = useState({})

	const scrollViewRef = useRef()

	useEffect(() => {
		loadProducts()
		getStorage()
	}, [])

	useEffect(() => {
		setProductTypesFiltered(
			productTypes.filter(x => x.productId === productId),
		)
	}, [productId])

	const handleAdd = async () => {
		const data = {
			amount,
			productId,
			description,
			productTypeId,
		}

		if (validateCreate(data, setErrors)) {
			setWorking(true)
			const success = await addStorage(data)
			if (success) {
				setAmount(1)
				setProductId(0)
				setDescription('')
				setProductTypeId(0)
				scrollViewRef.current.scrollToEnd()
			} else {
				ToastService.serverError()
			}
			setWorking(false)
		}
	}

	const handleEdit = id => {
		if (orderItems && orderItems.length > 0) {
			ToastService.show({ message: translate('storage.errors.cantEdit') })
		} else {
			const storedItem = storedItems.find(x => x.id === id)
			setStorageItemEdit(storedItem)
			navigation.navigate(screens.editStorage)
		}
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<CloseKeyboardView>
				<RecentRegisterPicker
					list={products}
					selectedId={productId}
					listRecent={recentProducts}
					setSelectedId={setProductId}
					errorMessage={errors.productId}
					label={translate('storage.product')}
					listLabel={translate('storage.products')}
					loading={!products || products.length === 0}
					labelNotRegistered={translate(
						'storage.registerNotListedProduct',
					)}
				/>
				<RecentRegisterPicker
					selectedId={productTypeId}
					list={productTypesFiltered}
					listRecent={recentProductTypes}
					setSelectedId={setProductTypeId}
					label={translate('storage.productType')}
					listLabel={translate('storage.productTypes')}
					loading={!productTypes || productTypes.length === 0}
					labelNotRegistered={translate(
						'storage.registerNotListedProductType',
					)}
				/>
				<TextInput
					value={description}
					setValue={setDescription}
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
					style={styles.stored}
					persistentScrollbar={true}
					showsVerticalScrollIndicator={true}>
					{storedItems && storedItems.length > 0
						? storedItems.map((item, index) => {
								return (
									<StoredItemCard
										key={index}
										amount={item.amount}
										product={item.productName}
										description={item.description}
										productType={item.productTypeName}
										onPress={() => {
											handleEdit(item.id)
										}}
									/>
								)
						  })
						: null}
				</ScrollView>
			</View>
		</ScreenBase>
	)
}

Storage.navigationOptions = () => ({
	title: translate('menus.storage'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapDispatchToProps = {
	addStorage: StorageCreators.add,
	getStorage: StorageCreators.get,
	setWorking: StorageCreators.setWorking,
	loadProducts: ProductCreators.loadProducts,
	setStorageItemEdit: EditStorageCreators.setStorageItem,
}

const mapStateToProps = ({ products, storage, order }) => ({
	working: storage.working,
	products: products.products,
	orderItems: order.orderItems,
	storedItems: storage.storedItems,
	productTypes: products.productTypes,
	recentProducts: products.recentProducts,
	recentProductTypes: products.recentProductTypes,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(Storage))
