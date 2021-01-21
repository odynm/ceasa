import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import styles from './styles'
import errors from 'src/constants/errors'
import orderStatus from 'src/enums/order'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Button from 'src/components/fw/button'
import ScreenHeaderDeleteOrder from './header'
import ToastService from 'src/services/toastService'
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
	loader,
	clients,
	setClient,
	setUrgent,
	sendOrder,
	navigation,
	orderItems,
	loadOrders,
	loadStorage,
	completedAt,
	deleteOrder,
	noConnection,
	setAppLoader,
	confirmDelete,
	setConfirmDelete,
	setDucksOrderStatus,
}) => {
	const [currentOrder, setCurrentOrder] = useState([])
	const [internalStatus, setInternalStatus] = useState(status)
	const [modalConfirmEdit, setModalConfirmEdit] = useState(false)

	useEffect(() => {
		setCurrentOrder([...orderItems])
	}, [id])

	const handleDelete = async () => {
		if (noConnection) {
			ToastService.show({ message: translate('app.noConnectionError') })
		} else {
			await deleteOrder(id)
			await loadOrders()
			navigation.navigate(screens.orders)
		}
	}

	const handleEdit = async () => {
		if (noConnection) {
			ToastService.show({ message: translate('app.noConnectionError') })
		} else {
			setAppLoader(true)
			await setDucksOrderStatus(internalStatus)
			const data = await sendOrder()
			if (data.success) {
				navigation.navigate(screens.orders)
			} else {
				if (data.data.errorCode === errors.ORDER_CANT_EDIT) {
					ToastService.show({
						message: translate('orders.errors.cantEditAnymore'),
					})
				}
			}
			await loadOrders()
			await loadStorage()
			setAppLoader(false)
		}
	}

	const handleEditProducts = () => {
		if (noConnection) {
			ToastService.show({ message: translate('app.noConnectionError') })
		} else {
			navigation.navigate(screens.editProductsOrder, {
				status,
			})
		}
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
					<ClientSegment
						client={client}
						clients={clients}
						setClient={setClient}
						editable={
							status !== orderStatus.carrying &&
							status !== orderStatus.done
						}
					/>
				</View>
				<Button
					small
					onPress={handleEditProducts}
					style={styles.editProductView}
					label={
						status !== orderStatus.done && status !== orderStatus.deleted
							? translate('editOrder.editProducts')
							: translate('editOrder.seeProducts')
					}
				/>
				{status === orderStatus.carrying ? (
					<>
						<Space />
						<KText
							bold
							text={`${translate('editOrder.loader')}: ${loader}`}
						/>
					</>
				) : (
					status === orderStatus.done && (
						<>
							<Space />
							<>
								{loader ? (
									<KText
										bold
										text={`${loader} ${translate(
											'editOrder.done',
										)} ${toHour(completedAt)}`}
									/>
								) : (
									<KText
										bold
										text={`${translate(
											'editOrder.doneNoCarrier',
										)} ${toHour(completedAt)}`}
									/>
								)}
							</>
						</>
					)
				)}
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
						<Space size2 />
					</View>
					<Button
						onPress={() => {
							if (orderStatus.released || orderStatus.carrying) {
								setModalConfirmEdit(true)
							} else {
								handleEdit()
							}
						}}
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
			<ConfirmationModal
				open={modalConfirmEdit}
				onAccept={handleEdit}
				onClose={() => setModalConfirmEdit(false)}
				header={translate('editOrder.editModal.header')}
				content={translate('editOrder.editModal.content')}
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
	loadStorage: StorageCreators.get,
	setAppLoader: AppCreators.setAppLoader,
	setClient: EditOrderCreators.setClient,
	setUrgent: EditOrderCreators.setUrgent,
	setStatus: EditOrderCreators.setStatus,
	sendOrder: EditOrderCreators.sendOrder,
	deleteOrder: EditOrderCreators.deleteOrder,
	loadOrders: OrdersVendorCreators.loadOrders,
	setDucksOrderStatus: EditOrderCreators.setStatus,
	setConfirmDelete: EditOrderCreators.setConfirmDelete,
}

const mapStateToProps = ({ app, client, editOrder }) => ({
	id: editOrder.id,
	clients: client.clients,
	status: editOrder.status,
	client: editOrder.client,
	urgent: editOrder.urgent,
	loader: editOrder.loader,
	noConnection: app.noConnection,
	orderItems: editOrder.orderItems,
	completedAt: editOrder.completedAt,
	confirmDelete: editOrder.confirmDelete,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditOrder))
