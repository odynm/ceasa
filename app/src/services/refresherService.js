import config from 'src/config'
import StorageService from './storageService'

let _stop = false
let _user
let _loader
let _loaderUserId
let _loadVendorOrders
let _loadLoaderOrders
let _getStorage
let _getHome

const setData = ({
	user,
	loader,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
	getStorage,
	getHome,
}) => {
	_user = user
	_loader = loader
	_loaderUserId = loaderUserId
	_loadVendorOrders = loadVendorOrders
	_loadLoaderOrders = loadLoaderOrders
	_getStorage = getStorage
	_getHome = getHome
}

const start = () => {
	StorageService.refresherRunning.get().then(val => {
		if (!val) {
			StorageService.refresherRunning.set(true)
			refresh()
		}
	})
}

const stop = () => {
	_stop = true
	StorageService.refresherRunning.set(false)
}

const refresh = () => {
	if (_user && _user.accessToken && _user.id) {
		// Vendor
		if (_loadVendorOrders) {
			_loadVendorOrders()
			// Storage
			_getStorage()
			// Home
			_getHome()
		}
	} else if (
		_loader &&
		_loader.accessToken &&
		_loader.id &&
		_loaderUserId > 0
	) {
		//Loader
		if (_loadLoaderOrders) {
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
