import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { withNavigation } from 'react-navigation'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import screens from 'src/constants/screens'
import OrderCard from 'src/ducks/order/card'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'

const OrdersLoader = ({ orderList, loadOrders, navigation }) => {
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
						loader={item.loader}
						status={item.status}
						clientKey={item.client.key}
						editOrder={() => {}}
						releasedHour={item.releasedAt && toHour(item.releasedAt)}
					/>
				))}
			</ScreenBase>
		</View>
	)
}

const mapDispatchToProps = {
	loadOrders: OrdersLoaderCreators.loadOrders,
}

const mapStateToProps = ({ ordersLoader }) => ({
	orderList: ordersLoader.orderList,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(OrdersLoader))
