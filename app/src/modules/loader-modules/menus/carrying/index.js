import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import { Selectors as OrdersLoaderSelectors } from 'src/ducks/orders-loader'
import styles from './styles'
import CarryCard from './card'
import Space from 'src/components/fw/space'
import Loader from 'src/components/fw/loader'
import ScreenBase from 'src/components/fw/screen-base'
import ClientSegment from 'src/components/ceasa/order/client-segment'

const Carrying = ({
	carryingList,
	loadCarryingOrders,
	carryingOrder,
	selectedCarryingOrderId,
	setSelectedCarryingOrderId,
}) => {
	useEffect(() => {
		loadCarryingOrders()
	}, [])

	useEffect(() => {
		if (carryingList && carryingList.length > 0) {
			setSelectedCarryingOrderId(carryingList[0].id)
		}
	}, [carryingList])

	return (
		<View>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<View style={styles.headerCards}>
					<ScrollView horizontal={true}>
						{carryingList.map((item, index) => (
							<CarryCard
								key={index}
								name={item.client.key}
								selected={item.id === selectedCarryingOrderId}
								onPress={() => {
									setSelectedCarryingOrderId(item.id)
								}}
							/>
						))}
					</ScrollView>
				</View>
				<Space size4 />
				{carryingOrder && carryingOrder.client ? (
					<ClientSegment client={carryingOrder.client} />
				) : (
					<Loader />
				)}
			</ScreenBase>
		</View>
	)
}

const mapDispatchToProps = {
	loadCarryingOrders: OrdersLoaderCreators.loadCarryingOrders,
	setSelectedCarryingOrderId: OrdersLoaderCreators.setSelectedCarryingOrderId,
}

const mapStateToProps = ({ ordersLoader }) => ({
	carryingList: ordersLoader.carryingList,
	selectedCarryingOrderId: ordersLoader.selectedCarryingOrderId,
	carryingOrder: OrdersLoaderSelectors.getOrderCarrying(ordersLoader),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(Carrying))
