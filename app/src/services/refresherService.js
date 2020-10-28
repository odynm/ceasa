import config from 'src/config'
import store from 'src/ducks'
import StorageService from './storageService'
import NetInfo from '@react-native-community/netinfo'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as OfflineCreators } from 'src/ducks/offline'

let _stop = false
let _user
let _loader
let _getHome
let _getStorage
let _loaderUserId
let _loadVendorOrders
let _loadLoaderOrders

const setData = ({
	user,
	loader,
	getHome,
	getStorage,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
}) => {
	_user = user
	_loader = loader
	_getHome = getHome
	_getStorage = getStorage
	_loaderUserId = loaderUserId
	_loadVendorOrders = loadVendorOrders
	_loadLoaderOrders = loadLoaderOrders
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

const refresh = async () => {
	const { inUse } = store.getState().offline

	NetInfo.fetch().then(data => {
		if (data.isInternetReachable) {
			if (inUse) {
				store.dispatch(OfflineCreators.executeQueue())
			} else {
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
			}
		} else {
			store.dispatch(AppCreators.setNoConnection(true))
		}
	})

	if (!_stop) {
		new Promise(function(resolve) {
			setTimeout(resolve, config.REFRESH_RATE_MS)
		}).then(refresh)
	}
}

const RefresherService = { start, stop, setData }

export default RefresherService
