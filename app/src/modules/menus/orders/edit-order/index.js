import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { toHour } from 'src/utils/date'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { jobTypes } from 'src/ducks/offline/jobTypes'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as OfflineCreators } from 'src/ducks/offline'
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
import InternetService from 'src/services/internetService'
import ClientSegment from 'src/components/ceasa/sell/client-segment'
import ConfirmationModal from 'src/components/fw/confirmation-modal'
import MissingItemsModal from 'src/components/ceasa/sell/missing-items-modal'

const EditOrder = ({
	clients,
	setClient,
	setUrgent,
	sendOrder,
	editOrder,
	addToQueue,
	navigation,
	loadOrders,
	loadStorage,
	deleteOrder,
	noConnection,
	setAppLoader,
	setConfirmDelete,
	createOfflineOrder,
	setDucksOrderStatus,
	deleteOrderOnOrdersList,
	deleteOrderOnOfflineQueue,
	restoreOfflineStorageAmount,
	increaseOfflineStorageAmount,
	decreaseOfflineStorageAmount,
}) => {
	// The current order state at edition start
	const [currentOrderSnapshot, setCurrentOrderSnapshot] = useState([])

	const [internalStatus, setInternalStatus] = useState(editOrder.status)
	const [modalConfirmEdit, setModalConfirmEdit] = useState(false)

	const [missingItems, setMissingItems] = useState([])

	useEffect(() => {
		setCurrentOrderSnapshot([...editOrder.orderItems])
	}, [editOrder.id, editOrder.orderItems]) // TODO this doesn't seem optimal at all, but it's working for now

	const handleDelete = async () => {
		if (noConnection || !(await InternetService.isInternetReachable())) {
			// If it's not an online order, nothing bad will happen
			// It will work has expected for both methods
			await deleteOrderOnOrdersList(editOrder.id, editOrder.offlineId)
			await deleteOrderOnOfflineQueue(editOrder.id, editOrder.offlineId)

			if (editOrder.offlineId > 0) {
				// Restore the offline storage with the previously collected data
				editOrder.offlineData.offlineStorageRestoreData.forEach(
					async item => {
						await restoreOfflineStorageAmount(item)
					},
				)
			} else {
				readdStorageItemsFromSnapshot()
			}
		} else {
			await deleteOrder(editOrder.id)
			await loadOrders()
		}
		navigation.navigate(screens.orders)
	}

	const handleEdit = async () => {
		setAppLoader(true)
		await setDucksOrderStatus(internalStatus)
		if (noConnection || !(await InternetService.isInternetReachable())) {
			/*
			Here we are:
				* deleting order from queue and orderslist
				* adding order to add queue
				* increasing storage items from previous order
				* decreasing storage items for new order
				* adding new order to orders list
			*/

			// If it's not an online order, nothing bad will happen
			// It will work has expected for both methods,
			// even if there's nothing to delete
			await deleteOrderOnOrdersList(editOrder.id, editOrder.offlineId)
			await deleteOrderOnOfflineQueue(editOrder.id, editOrder.offlineId)

			await addToQueue(jobTypes.addOrder, {
				...editOrder,
				id: undefined,
			})

			readdStorageItemsFromSnapshot()

			const offlineStorageRestoreData = []

			editOrder.orderItems.forEach(async item => {
				offlineStorageRestoreData.push(
					await decreaseOfflineStorageAmount(
						item.productId,
						item.productTypeId,
						item.descriptionId,
						item.amount,
					),
				)
			})

			const offlineOrder = {
				offlineId: new Date().getTime(),
				offlineData: { offlineStorageRestoreData },
				client: editOrder.client,
				products: editOrder.orderItems.map(item => ({
					...item,
					unitPrice: item.unitPrice.value * 100,
					productId: item.productId,
					productTypeId: item.productTypeId,
					descriptionId: item.descriptionId,
				})),
				status: editOrder.status,
				createdAt: new Date(),
				generateLoad: editOrder.generateLoad,
			}

			await createOfflineOrder(offlineOrder)
			navigation.navigate(screens.orders)
		} else {
			const { success, data } = await sendOrder()
			if (success) {
				navigation.navigate(screens.orders)
			} else {
				if (data?.data?.errorCode === errors.ORDER_CANT_EDIT) {
					ToastService.show({
						message: translate('orders.errors.cantEditAnymore'),
					})
				} else {
					if (data?.data) {
						setMissingItems(data.data)
					} else {
						console.warn('ERRO EDIÇÃO NÃO DEFINIDO')
					}
				}
			}
			await loadOrders()
			await loadStorage()
		}
		setAppLoader(false)
	}

	const handleEditProducts = () => {
		navigation.navigate(screens.editProductsOrder, {
			status: editOrder.status,
			currentOrderSnapshot,
		})
	}

	const setOrderStatus = checked => {
		if (checked) {
			setInternalStatus(orderStatus.released)
		} else {
			setInternalStatus(orderStatus.blocked)
		}
	}

	const readdStorageItemsFromSnapshot = () => {
		currentOrderSnapshot.forEach(async item => {
			if (item.isMerged) {
				item.mergedData.items.forEach(x => {
					increaseOfflineStorageAmount({
						productId: item.productId,
						productTypeId: item.productTypeId,
						descriptionId: item.descriptionId,
						costPrice: x.costPrice,
						storageAmount: x.storageAmount,
					})
				})
			} else {
				increaseOfflineStorageAmount({
					productId: item.productId,
					productTypeId: item.productTypeId,
					descriptionId: item.descriptionId,
					costPrice: item.costPrice,
					storageAmount: item.storageAmount,
				})
			}
		})
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
						client={editOrder.client}
						clients={clients}
						setClient={setClient}
						editable={
							editOrder.status !== orderStatus.carrying &&
							editOrder.status !== orderStatus.done
						}
					/>
				</View>
				<Button
					small
					onPress={handleEditProducts}
					style={styles.editProductView}
					label={
						editOrder.status !== orderStatus.done &&
						editOrder.status !== orderStatus.deleted
							? translate('editOrder.editProducts')
							: translate('editOrder.seeProducts')
					}
				/>
				{editOrder.status === orderStatus.carrying ? (
					<>
						<Space />
						<KText
							bold
							text={`${translate('editOrder.loader')}: ${
								editOrder.loader
							}`}
						/>
					</>
				) : (
					editOrder.status === orderStatus.done && (
						<>
							<Space />
							<>
								{editOrder.loader ? (
									<KText
										bold
										text={`${editOrder.loader} ${translate(
											'editOrder.done',
										)} ${toHour(editOrder.completedAt)}`}
									/>
								) : (
									<KText
										bold
										text={`${translate(
											'editOrder.doneNoCarrier',
										)} ${toHour(editOrder.completedAt)}`}
									/>
								)}
							</>
						</>
					)
				)}
				<View style={styles.footer}>
					{editOrder.status === orderStatus.blocked && (
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
							value={editOrder.urgent}
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
				open={editOrder.confirmDelete}
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
			<MissingItemsModal
				onFinish={() => {
					navigation.goBack()
				}}
				missingItems={missingItems}
				setMissingItems={setMissingItems}
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
	addToQueue: OfflineCreators.addToQueue,
	deleteOrder: EditOrderCreators.deleteOrder,
	loadOrders: OrdersVendorCreators.loadOrders,
	setDucksOrderStatus: EditOrderCreators.setStatus,
	setConfirmDelete: EditOrderCreators.setConfirmDelete,
	deleteOrderOnOfflineQueue: OfflineCreators.deleteOrder,
	deleteOrderOnOrdersList: OrdersVendorCreators.deleteOrder,
	createOfflineOrder: OrdersVendorCreators.createOfflineOrder,
	restoreOfflineStorageAmount: StorageCreators.restoreOfflineStorageAmount,
	increaseOfflineStorageAmount: StorageCreators.increaseOfflineStorageAmount,
	decreaseOfflineStorageAmount: StorageCreators.decreaseOfflineStorageAmount,
}

const mapStateToProps = ({ app, client, editOrder }) => ({
	editOrder: editOrder,
	clients: client.clients,
	noConnection: app.noConnection,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditOrder))
