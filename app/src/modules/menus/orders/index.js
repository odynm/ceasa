import React, { useEffect } from 'react'
import { View } from 'react-native'
import { hp } from 'src/utils/screen'
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
	setOrder,
	orderList,
	loadOrders,
	navigation,
	setOrderItems,
}) => {
	useEffect(() => {
		loadOrders()
	}, [])

	const editOrder = ({ item }) => {
		setOrder(item)

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
				useScroll={true}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<View style={{ marginBottom: hp(50) }}>
					{orderList.map((item, index) => (
						<OrderCard
							key={index}
							urgent={item.urgent}
							loader={item.loader}
							status={item.status}
							clientKey={item.client.key}
							onPress={() => editOrder({ item })}
							releasedHour={item.releasedAt && toHour(item.releasedAt)}
						/>
					))}
				</View>
			</ScreenBase>
		</View>
	)
}

const mapDispatchToProps = {
	setOrder: EditOrderCreators.setOrder,
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
