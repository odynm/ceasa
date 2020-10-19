import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import RefresherService from 'src/services/refresherService'

const Refresher = ({
	user,
	loader,
	getStorage,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
}) => {
	useEffect(() => {
		RefresherService.start()
		return RefresherService.stop
	}, [])

	useEffect(() => {
		RefresherService.setData({
			user,
			loader,
			loaderUserId,
			loadVendorOrders,
			loadLoaderOrders,
			getStorage,
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
	getStorage: StorageCreators.get,
	loadVendorOrders: OrdersVendorCreators.loadOrders,
	loadLoaderOrders: OrdersLoaderCreators.loadOrders,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Refresher)
