import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Quantity from 'src/components/fw/quantity'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'

import httpService from 'src/services/httpService'

const Register = ({
	products,
	productTypes,
	recentProducts,
	recentProductTypes,
}) => {
	const teste = async () => {
		const a = await httpService.post('storage', { teste: '' })
		console.warn(a)
	}

	const [selectedProductId, setSelectedProductId] = useState(0)
	const [selectedTypeId, setSelectedTypeId] = useState(0)
	const [additionalDescription, setAdditionalDescription] = useState('')
	const [quantity, setQuantity] = useState(1)

	useEffect(() => {
		teste()
	}, [])

	return (
		<ScreenBase>
			<RecentRegisterPicker
				setSelectedId={setSelectedProductId}
				list={products}
				listRecent={recentProducts}
				label={translate('register.product')}
				listLabel={translate('register.products')}
				labelNotRegistered={translate('register.registerNotListedProduct')}
			/>
			<Space />
			<RecentRegisterPicker
				setSelectedId={setSelectedTypeId}
				list={productTypes}
				listRecent={recentProductTypes}
				label={translate('register.productTypes')}
				listLabel={translate('register.productTypes')}
				labelNotRegistered={translate(
					'register.registerNotListedProductType',
				)}
			/>
			<Space />
			<TextInput
				value={additionalDescription}
				setValue={setAdditionalDescription}
				label={translate('register.additionalDescription')}
			/>
			<Space size2 />
			<Quantity
				value={quantity}
				setValue={setQuantity}
				label={translate('register.quantity')}
			/>
			<Space size2 />
			<Button label={translate('register.add')} />
		</ScreenBase>
	)
}

Register.navigationOptions = () => ({
	title: translate('menus.register'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {}

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
