import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import { validateCreate } from 'src/ducks/storage/validations/create'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Quantity from 'src/components/fw/quantity'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'

const Register = ({
	products,
	addStorage,
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
		}
	}

	return (
		<ScreenBase>
			<RecentRegisterPicker
				errorMessage={errors.selectedProductId}
				list={products}
				listRecent={recentProducts}
				selectedId={selectedProductId}
				setSelectedId={setSelectedProductId}
				label={translate('register.product')}
				listLabel={translate('register.products')}
				loading={!products || products.length === 0}
				labelNotRegistered={translate('register.registerNotListedProduct')}
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
		</ScreenBase>
	)
}

Register.navigationOptions = () => ({
	title: translate('menus.register'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	addStorage: StorageCreators.add,
	loadProducts: ProductCreators.loadProducts,
}

const mapStateToProps = ({ products }) => ({
	products: products.products,
	productTypes: products.productTypes,
	recentProducts: products.recentProducts,
	recentProductTypes: products.recentProductTypes,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Register)
