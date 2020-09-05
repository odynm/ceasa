import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { withNavigation } from 'react-navigation'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import screens from 'src/constants/screens'
import ScreenBase from 'src/components/fw/screen-base'
import OrderCard from 'src/components/ceasa/order/card'

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
		<View>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				{orderList.map((item, index) => (
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
					/>
				))}
			</ScreenBase>
		</View>
	)
}

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
