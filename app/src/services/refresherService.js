import config from 'src/config'
import StorageService from './storageService'

let _stop = true
let _user
let _loader
let _loaderUserId
let _loadVendorOrders
let _loadLoaderOrders

const setData = ({
	user,
	loader,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
}) => {
	_user = user
	_loader = loader
	_loaderUserId = loaderUserId
	_loadVendorOrders = loadVendorOrders
	_loadLoaderOrders = loadLoaderOrders
}

const start = async () => {
	if (!(await StorageService.refresherRunning.get())) {
		await StorageService.refresherRunning.set(true)
		refresh()
	}
}

const stop = () => {
	_stop = true
}

const refresh = () => {
	if (_user && _user.accessToken && _user.id) {
		// Vendor
		if (_loadVendorOrders) {
			_loadVendorOrders()
		}
	} else if (
		_loader &&
		_loader.accessToken &&
		_loader.id &&
		_loaderUserId > 0
	) {
		//Loader
		if (_loadLoaderOrders) {
			console.warn('here')
			_loadLoaderOrders()
		}
	}

	if (!_stop) {
		new Promise(function(resolve) {
			setTimeout(resolve, config.REFRESH_RATE_MS)
		}).then(refresh)
	}
}

const RefresherService = { start, stop, setData }

export default RefresherService
