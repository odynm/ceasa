import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import { Selectors as OrdersLoaderSelectors } from 'src/ducks/orders-loader'
import styles from './styles'
import CarryCard from './carry-card'
import ProductCard from './product-card'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Loader from 'src/components/fw/loader'
import ModalNotDelivered from './modal-not-delivered'
import ScreenBase from 'src/components/fw/screen-base'
import ClientSegment from 'src/components/ceasa/order/client-segment'

const Carrying = ({
	carryingList,
	carryingOrder,
	finishCarrying,
	loadCarryingOrders,
	setAmountDelivered,
	selectedCarryingOrderId,
	setSelectedCarryingOrderId,
}) => {
	const [modalWarning, setModalWarning] = useState(false)

	useEffect(() => {
		loadCarryingOrders()
	}, [])

	useEffect(() => {
		if (carryingList && carryingList.length > 0) {
			setSelectedCarryingOrderId(carryingList[0].id)
		}
	}, [carryingList])

	const handleFinish = () => {
		finishCarrying({
			orderId: carryingOrder.id,
			products: carryingOrder.products,
		})
		setSelectedCarryingOrderId(carryingList[0].id)
	}

	const handlePress = () => {
		if (carryingOrder.products.some(x => x.amountDelivered !== x.amount)) {
			setModalWarning(true)
		} else {
			handleFinish()
		}
	}

	const handleCloseModalYes = () => {
		setModalWarning(false)
		handleFinish()
	}

	return (
		<>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<View style={styles.headerCards}>
					<ScrollView
						showsHorizontalScrollIndicator={false}
						style={styles.scrollView}
						horizontal={true}>
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
					<>
						<ClientSegment client={carryingOrder.client} />
						<KText text={translate('loaderOrderInfo.products')} />
						<ScrollView>
							{carryingOrder.products.map((item, index) => (
								<ProductCard
									key={index}
									id={item.id}
									amount={item.amount}
									orderId={carryingOrder.id}
									product={item.productName}
									description={item.description}
									productType={item.productTypeName}
									amountDelivered={item.amountDelivered}
									setAmountDelivered={setAmountDelivered}
								/>
							))}
						</ScrollView>
						<View style={styles.footer}>
							{false ? (
								<Loader />
							) : (
								<Button
									onPress={handlePress}
									label={translate('loaderCarrying.finish')}
								/>
							)}
						</View>
					</>
				) : (
					<Loader />
				)}
			</ScreenBase>
			<ModalNotDelivered
				open={modalWarning}
				products={
					carryingOrder && carryingOrder.products
						? carryingOrder.products.filter(
								x => x.amount === x.amountDelivered,
						  )
						: []
				}
				handleCloseYes={handleCloseModalYes}
				handleCloseNo={() => {
					setModalWarning(false)
				}}
			/>
		</>
	)
}

const mapDispatchToProps = {
	finishCarrying: OrdersLoaderCreators.finishCarrying,
	loadCarryingOrders: OrdersLoaderCreators.loadCarryingOrders,
	setAmountDelivered: OrdersLoaderCreators.setAmountDelivered,
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
