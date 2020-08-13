import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { withNavigation } from 'react-navigation'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import OrderCard from './components/card'
import screens from 'src/constants/screens'
import ScreenBase from 'src/components/fw/screen-base'

const OrdersVendor = ({
	setClient,
	setStatus,
	orderList,
	loadOrders,
	navigation,
}) => {
	useEffect(() => {
		loadOrders()
	}, [])

	const editOrder = ({ client, status }) => {
		setStatus(status)
		setClient(client)
		navigation.navigate(screens.editOrder)
	}

	return (
		<View>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				{orderList.map((item, index) => (
					<OrderCard
						key={index}
						loader={item.loader}
						status={item.status}
						clientKey={item.client.key}
						editOrder={() =>
							editOrder({ client: item.client, status: item.status })
						}
						releasedHour={item.releasedAt && toHour(item.releasedAt)}
					/>
				))}
			</ScreenBase>
		</View>
	)
}

const mapDispatchToProps = {
	setStatus: EditOrderCreators.setStatus,
	setClient: EditOrderCreators.setClient,
	loadOrders: OrdersVendorCreators.loadOrders,
}

const mapStateToProps = ({ ordersVendor }) => ({
	orderList: ordersVendor.orderList,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(OrdersVendor))
