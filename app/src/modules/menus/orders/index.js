import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { withNavigation } from 'react-navigation'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import screens from 'src/constants/screens'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'
import OrderCard from 'src/components/ceasa/order/card'

const OrdersVendor = ({
	setClient,
	setStatus,
	orderList,
	loadOrders,
	navigation,
	setOrderItems,
}) => {
	useEffect(() => {
		loadOrders()
	}, [])

	const editOrder = ({ item }) => {
		setStatus(item.status)
		setClient(item.client)

		setOrderItems(
			item.products.map(x => ({
				...x,
				unitPrice: MoneyService.toMoney(x.unitPrice / 100),
				total: MoneyService.toMoney(x.amount * (x.unitPrice / 100)),
			})),
		)
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
						onPress={() => editOrder({ item })}
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
	setOrderItems: EditOrderCreators.setOrderItems,
}

const mapStateToProps = ({ ordersVendor }) => ({
	orderList: ordersVendor.orderList,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(OrdersVendor))
