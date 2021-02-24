import config from 'src/config'
import store from 'src/ducks'
import StorageService from './storageService'
import InternetService from 'src/services/internetService'
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
let _loadCarryingOrders

const setData = ({
	user,
	loader,
	getHome,
	getStorage,
	loaderUserId,
	loadVendorOrders,
	loadLoaderOrders,
	loadCarryingOrders,
}) => {
	_user = user
	_loader = loader
	_getHome = getHome
	_getStorage = getStorage
	_loaderUserId = loaderUserId
	_loadVendorOrders = loadVendorOrders
	_loadLoaderOrders = loadLoaderOrders
	_loadCarryingOrders = loadCarryingOrders
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

	const isInternetReachable = await InternetService.isInternetReachable()
	if (isInternetReachable) {
		if (inUse) {
			store.dispatch(OfflineCreators.executeQueue())
		} else {
			const requests = []

			if (_user && _user.accessToken && _user.id) {
				// Vendor
				if (_loadVendorOrders) {
					requests.push(_loadVendorOrders())
					// Storage
					requests.push(_getStorage())
					// Home
					requests.push(_getHome())
				}
			} else if (
				_loader &&
				_loader.accessToken &&
				_loader.id &&
				_loaderUserId > 0
			) {
				//Loader
				if (_loadLoaderOrders) {
					requests.push(_loadLoaderOrders())
					requests.push(_loadCarryingOrders())
				}
			}

			await promiseResolveAllSettled(requests)
		}
	} else {
		store.dispatch(AppCreators.setNoConnection(true))
	}

	if (!_stop) {
		new Promise(function(resolve) {
			setTimeout(resolve, config.REFRESH_RATE_MS)
		}).then(refresh)
	}
}

// Promise.allSettled is not yet available, so we use this polyfill
const promiseResolveAllSettled = function(promises) {
	let mappedPromises = promises.map(p => {
		return p
			.then(value => {
				return {
					status: 'fulfilled',
					value,
				}
			})
			.catch(reason => {
				return {
					status: 'rejected',
					reason,
				}
			})
	})
	return Promise.all(mappedPromises)
}

const RefresherService = { start, stop, setData }

export default RefresherService
