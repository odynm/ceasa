import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import OrdersVendor from './orders-vendor'
import ScreenHeader from 'src/components/fw/screen-header'

const Orders = ({ accountType }) => {
	return <OrdersVendor />
}

Orders.navigationOptions = () => ({
	title: translate('menus.orders'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapStateToProps = ({}) => ({
	//accountType: t.t,
})

export default connect(mapStateToProps)(Orders)
