import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { hp } from 'src/utils/screen'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import screens from 'src/constants/screens'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'
import OrderCard from 'src/components/ceasa/order/card'
import ScreenHeader from 'src/components/fw/screen-header'
import MergedProductsService from 'src/services/mergedProductsService'

const OrdersVendor = ({
	setOrder,
	orderList,
	loadOrders,
	navigation,
	setOrderItems,
}) => {
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		initialize()
	}, [])

	const initialize = async () => {
		setLoading(true)
		await loadOrders()
		setLoading(false)
	}

	const editOrder = ({ item }) => {
		const orderItemsMerged = MergedProductsService.mergeSimilarProducts(
			item.products,
		)

		// Update the costPrice for the merged items
		const orderItemsMergedWithCostPrice = orderItemsMerged.map(mergedItem => {
			if (mergedItem.isMerged) {
				const converted = mergedItem.mergedData.items.map(x => ({
					...x,
					costPrice: MoneyService.toMoney(x.costPrice / 100),
				}))

				return {
					...mergedItem,
					mergedData: { ...mergedItem.mergedData, items: converted },
				}
			} else {
				return mergedItem
			}
		})

		const orderItems = orderItemsMergedWithCostPrice.map(x => ({
			...x,
			costPrice: MoneyService.toMoney(x.costPrice / 100),
			unitPrice: MoneyService.toMoney(x.unitPrice / 100),
			total: MoneyService.toMoney(x.amount * (x.unitPrice / 100)),
		}))

		setOrder(item)
		setOrderItems(orderItems)
		navigation.navigate(screens.editOrder)
	}

	return (
		<>
			{loading ? (
				<Loader fullScreen />
			) : (
				<ScreenBase
					useScroll={true}
					useKeyboardAvoid={false}
					useKeyboardClose={false}>
					{orderList && orderList.length > 0 ? (
						<View style={{ marginBottom: hp(50) }}>
							{orderList.map((item, index) => (
								<OrderCard
									key={index}
									urgent={item.urgent}
									loader={item.loader}
									status={item.status}
									clientKey={item.client.key}
									onPress={() => editOrder({ item })}
									releasedHour={
										item.releasedAt && toHour(item.releasedAt)
									}
									completedHour={
										item.completedAt && toHour(item.completedAt)
									}
								/>
							))}
						</View>
					) : (
						<View>
							<KText text={translate('orders.none')} />
						</View>
					)}
				</ScreenBase>
			)}
		</>
	)
}

OrdersVendor.navigationOptions = () => ({
	title: translate('menus.orders'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

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
