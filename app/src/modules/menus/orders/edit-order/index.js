import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import styles from './styles'
import orderStatus from 'src/enums/order'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Button from 'src/components/fw/button'
import ScreenHeaderDeleteOrder from './header'
import ScreenBase from 'src/components/fw/screen-base'
import CheckBox from '@react-native-community/checkbox'
import ScreenHeader from 'src/components/fw/screen-header'
import ClientSegment from 'src/components/ceasa/sell/client-segment'
import ConfirmationModal from 'src/components/fw/confirmation-modal'

const EditOrder = ({
	id,
	client,
	status,
	urgent,
	setClient,
	setUrgent,
	sendOrder,
	navigation,
	loadOrders,
	deleteOrder,
	setAppLoader,
	confirmDelete,
	setConfirmDelete,
}) => {
	const [internalStatus, setInternalStatus] = useState(status)

	const handleDelete = async () => {
		await deleteOrder(id)
		await loadOrders()
		navigation.navigate(screens.orders)
	}

	const handleEdit = async () => {
		setAppLoader(true)
		await sendOrder()
		setAppLoader(false)
		navigation.navigate(screens.orders)
	}

	const handleEditProducts = () => {
		navigation.navigate(screens.editProductsOrder)
	}

	const setOrderStatus = checked => {
		if (checked) {
			setInternalStatus(orderStatus.released)
		} else {
			setInternalStatus(orderStatus.blocked)
		}
	}

	return (
		<>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				{internalStatus === orderStatus.blocked && (
					<View>
						<View style={styles.strip}>
							<KText
								bold
								style={styles.blocked}
								text={translate('orders.blocked')}
							/>
						</View>
					</View>
				)}
				<View style={styles.client}>
					<ClientSegment client={client} setClient={setClient} />
				</View>
				<Button
					small
					onPress={handleEditProducts}
					style={styles.editProductView}
					label={translate('editOrder.editProducts')}
				/>
				<View style={styles.footer}>
					{status === orderStatus.blocked && (
						<View style={styles.row}>
							<KText
								bold
								style={styles.rowAlignText}
								text={translate('editOrder.released')}
							/>
							<CheckBox
								value={internalStatus === orderStatus.released}
								style={styles.checkbox}
								onValueChange={checked => setOrderStatus(checked)}
							/>
						</View>
					)}
					<View style={styles.row}>
						<KText
							bold
							style={styles.rowAlignText}
							text={translate('editOrder.urgent')}
						/>
						<CheckBox
							value={urgent}
							style={styles.checkbox}
							onValueChange={checked => setUrgent(checked)}
						/>
					</View>
					<Space size2 />
					<Button
						onPress={handleEdit}
						label={translate('editOrder.edit')}
					/>
				</View>
			</ScreenBase>
			<ConfirmationModal
				open={confirmDelete}
				onAccept={handleDelete}
				onClose={() => setConfirmDelete(false)}
				header={translate('editOrder.deleteModal.header')}
				content={translate('editOrder.deleteModal.content')}
			/>
		</>
	)
}

EditOrder.navigationOptions = () => ({
	title: translate('menus.editOrder'),
	headerLeft: props => <ScreenHeader {...props} />,
	headerRight: props => <ScreenHeaderDeleteOrder {...props} />,
})

const mapDispatchToProps = {
	setAppLoader: AppCreators.setAppLoader,
	setClient: EditOrderCreators.setClient,
	setUrgent: EditOrderCreators.setUrgent,
	setStatus: EditOrderCreators.setStatus,
	sendOrder: EditOrderCreators.sendOrder,
	deleteOrder: EditOrderCreators.deleteOrder,
	loadOrders: OrdersVendorCreators.loadOrders,
	setConfirmDelete: EditOrderCreators.setConfirmDelete,
}

const mapStateToProps = ({ editOrder }) => ({
	id: editOrder.id,
	status: editOrder.status,
	client: editOrder.client,
	urgent: editOrder.urgent,
	confirmDelete: editOrder.confirmDelete,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditOrder))
