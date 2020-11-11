import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import screens from 'src/constants/screens'
import KText from 'src/components/fw/ktext'
import ScreenBase from 'src/components/fw/screen-base'
import OrderCard from 'src/components/ceasa/order/card'
import ScreenHeader from 'src/components/fw/screen-header'

const OrdersLoader = ({
	orderList,
	loadOrders,
	navigation,
	setSelectedOrderId,
}) => {
	useEffect(() => {
		loadOrders()
	}, [])

	return (
		<ScreenBase
			useScroll={true}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			{orderList && orderList.length > 0 ? (
				orderList.map((item, index) => (
					<OrderCard
						key={index}
						urgent={item.urgent}
						loader={item.loader}
						status={item.status}
						clientKey={item.client.key}
						onPress={() => {
							setSelectedOrderId(item.id)
							navigation.navigate(screens.loaderOrderInfo)
						}}
						releasedHour={item.releasedAt && toHour(item.releasedAt)}
						completedHour={item.completedAt && toHour(item.completedAt)}
					/>
				))
			) : (
				<View style={{ alignItems: 'center' }}>
					<KText text={translate('orders.noOrdersYet')} />
				</View>
			)}
		</ScreenBase>
	)
}

OrdersLoader.navigationOptions = () => ({
	title: translate('loaderMenus.orders'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapDispatchToProps = {
	loadOrders: OrdersLoaderCreators.loadOrders,
	setSelectedOrderId: OrdersLoaderCreators.setSelectedOrderId,
}

const mapStateToProps = ({ ordersLoader }) => ({
	orderList: ordersLoader.orderList,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(OrdersLoader))
