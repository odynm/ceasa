import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import { Selectors as OrdersLoaderSelectors } from 'src/ducks/orders-loader'
import styles from './styles'
import CarryCard from './carry-card'
import ProductCard from './product-card'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Loader from 'src/components/fw/loader'
import AppLoader from 'src/components/fw/app-loader'
import ModalNotDelivered from './modal-not-delivered'
import ScreenBase from 'src/components/fw/screen-base'
import ConfirmationModal from 'src/components/fw/confirmation-modal'
import ClientSegment from 'src/components/ceasa/order/client-segment'

const Carrying = ({
	setAppLoader,
	carryingList,
	carryingOrder,
	finishCarrying,
	loadCarryingOrders,
	setAmountDelivered,
	selectedCarryingOrderId,
	setSelectedCarryingOrderId,
}) => {
	const [modalAccept, setModalAccept] = useState(false)
	const [modalWarning, setModalWarning] = useState(false)

	const initialize = async () => {
		setAppLoader(true)
		await loadCarryingOrders()
		setAppLoader(false)
	}

	useEffect(() => {
		initialize()
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
			setModalAccept(true)
		}
	}

	const handleCloseModalYes = () => {
		setModalWarning(false)
		handleFinish()
	}

	return (
		<AppLoader solid>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<View style={styles.headerCards}>
					<ScrollView
						horizontal={true}
						style={styles.scrollView}
						showsHorizontalScrollIndicator={false}>
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
					<KText text={translate('loaderCarrying.none')} />
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
				handleCloseNo={() => {
					setModalWarning(false)
				}}
				handleCloseYes={handleCloseModalYes}
			/>
			<ConfirmationModal
				open={modalAccept}
				onAccept={handleFinish}
				onClose={() => setModalAccept(false)}
				header={translate('loaderCarrying.modalAccept.header')}
				content={translate('loaderCarrying.modalAccept.content')}
			/>
		</AppLoader>
	)
}

const mapDispatchToProps = {
	setAppLoader: AppCreators.setAppLoader,
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