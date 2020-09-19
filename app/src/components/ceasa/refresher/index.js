import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Creators as OrdersVendorCreators } from 'src/ducks/orders-vendor'
import { Creators as OrdersLoaderCreators } from 'src/ducks/orders-loader'
import RefresherService from 'src/services/refresherService'

const Refresher = ({
	user,
	loader,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
}) => {
	useEffect(() => {
		start()
		return RefresherService.stop
	}, [])

	const start = async () => {
		await RefresherService.start()
	}

	useEffect(() => {
		RefresherService.setData({
			user,
			loader,
			loaderUserId,
			loadVendorOrders,
			loadLoaderOrders,
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
	loadVendorOrders: OrdersVendorCreators.loadOrders,
	loadLoaderOrders: OrdersLoaderCreators.loadOrders,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Refresher)
