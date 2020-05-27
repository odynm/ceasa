import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import Space from 'src/components/fw/space'

const Register = ({
	products,
	productTypes,
	recentProducts,
	recentProductTypes,
}) => {
	return (
		<ScreenBase>
			<RecentRegisterPicker
				list={products}
				listRecent={recentProducts}
				label={translate('register.product')}
				listLabel={translate('register.products')}
				labelNotRegistered={translate('register.registerNotListedProduct')}
			/>
			<Space />
			<RecentRegisterPicker
				list={productTypes}
				listRecent={recentProductTypes}
				label={translate('register.productTypes')}
				listLabel={translate('register.productTypes')}
				labelNotRegistered={translate(
					'register.registerNotListedProductType',
				)}
			/>
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
