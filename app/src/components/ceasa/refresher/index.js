import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Creators as HomeCreators } from 'src/ducks/home'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as OfflineCreators } from 'src/ducks/offline'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import { Creators as AdditionalCostCreators } from 'src/ducks/additional-cost'
import RefresherService from 'src/services/refresherService'
import StorageService from 'src/services/storageService'

const Refresher = ({
	user,
	loader,
	getHome,
	getStorage,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
	loadCarryingOrders,
	setOrderList,
	setOfflineQueue,
	setStoredItems,
	setAdditionalCosts,
}) => {
	const initialize = async () => {
		const offlineInUse = await StorageService.offlineInUse.get()
		console.warn('init offlineInUse', offlineInUse)

		if (offlineInUse) {
			const offlineOrders = await StorageService.offlineOrders.get()
			const offlineQueue = await StorageService.offlineQueue.get()
			const offlineStoredItems = await StorageService.offlineStoredItems.get()
			const offlineAdditionalCosts = await StorageService.offlineAdditionalCosts.get()

			console.warn('offlineQueue', offlineQueue)
			setOrderList(offlineOrders)
			setOfflineQueue(offlineQueue)
			setStoredItems(offlineStoredItems)
			setAdditionalCosts(offlineAdditionalCosts)
			here
			/*for some reason, offline queue is setting correctly, but it's not running
			as it should. no idea why.
			*/

			setTimeout(() => RefresherService.start(), 1000)
		}
	}

	useEffect(() => {
		initialize()

		return RefresherService.stop
	}, [])

	useEffect(() => {
		RefresherService.setData({
			user,
			loader,
			getHome,
			getStorage,
			loaderUserId,
			loadVendorOrders,
			loadLoaderOrders,
			loadCarryingOrders,
		})
	}, [loader, user, loaderUserId])

	return null
}

const mapStateToProps = ({ user, loader }) => ({
	user: user.user,
	loader: loader.loader,
	loaderUserId: loader.userId,
})

const mapDispatchToProps = {
	getHome: HomeCreators.loadHome,
	getStorage: StorageCreators.get,
	setOfflineQueue: OfflineCreators.setQueue,
	setStoredItems: StorageCreators.setStoredItems,
	setOrderList: OrdersVendorCreators.setOrderList,
	loadVendorOrders: OrdersVendorCreators.loadOrders,
	loadLoaderOrders: OrdersLoaderCreators.loadOrders,
	loadCarryingOrders: OrdersLoaderCreators.loadCarryingOrders,
	setAdditionalCosts: AdditionalCostCreators.setAdditionalCosts,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Refresher)
