import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const Register = ({ products, recentProducts }) => {
	return (
		<ScreenBase>
			<RecentRegisterPicker
				list={products}
				listRecent={recentProducts}
				label={translate('register.product')}
				listLabel={translate('register.products')}
				labelNotRegistered={translate('register.registerNotListed')}
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
	recentProducts: products.recentProducts,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Register)
