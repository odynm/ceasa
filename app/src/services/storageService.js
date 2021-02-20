import AsyncStorage from '@react-native-community/async-storage'

const setItem = key => async item => {
	try {
		if (item) {
			await AsyncStorage.setItem(key, JSON.stringify(item))
		} else {
			await AsyncStorage.removeItem(key)
		}
	} catch (error) {
		console.warn(error)
	}
}

const getItem = key => async defaultValue => {
	try {
		const item = await AsyncStorage.getItem(key)
		if (item) {
			const parsedItem = JSON.parse(item)
			if (defaultValue === undefined && parsedItem !== null) {
				return parsedItem
			}
		}
		return defaultValue
	} catch (error) {
		console.warn(error)
	}
}

const removeItem = key => async () => {
	try {
		await AsyncStorage.removeItem(key)
	} catch (error) {
		console.warn(error)
	}
}

const keys = {
	user: 'user',
	loginType: 'loginType',
	rememberMe: 'rememberMe',
	introduction: 'introduction',
	offlineInUse: 'offlineInUse',
	offlineQueue: 'offlineQueue',
	offlineOrders: 'offlineOrders', // to save order list state
	refresherRunning: 'refresherRunning',
	offlineStoredItems: 'offlineStoredItems', // to save stogae state
	offlineAdditionalCosts: 'offlineAdditionalCosts', // to save cost list state
}

const StorageService = {
	user: {
		get: getItem(keys.user),
		set: setItem(keys.user),
		remove: removeItem(keys.user),
	},
	introduction: {
		get: getItem(keys.introduction),
		set: setItem(keys.introduction),
		remove: removeItem(keys.introduction),
	},
	loginType: {
		get: getItem(keys.loginType),
		set: setItem(keys.loginType),
		remove: removeItem(keys.loginType),
	},
	rememberMe: {
		get: getItem(keys.rememberMe),
		set: setItem(keys.rememberMe),
		remove: removeItem(keys.rememberMe),
	},
	offlineInUse: {
		get: getItem(keys.offlineInUse),
		set: setItem(keys.offlineInUse),
		remove: removeItem(keys.offlineInUse),
	},
	offlineQueue: {
		get: getItem(keys.offlineQueue),
		set: setItem(keys.offlineQueue),
		remove: removeItem(keys.offlineQueue),
	},
	offlineOrders: {
		get: getItem(keys.offlineOrders),
		set: setItem(keys.offlineOrders),
		remove: removeItem(keys.offlineOrders),
	},
	refresherRunning: {
		get: getItem(keys.refresherRunning),
		set: setItem(keys.refresherRunning),
		remove: removeItem(keys.refresherRunning),
	},
	offlineStoredItems: {
		get: getItem(keys.offlineStoredItems),
		set: setItem(keys.offlineStoredItems),
		remove: removeItem(keys.offlineStoredItems),
	},
	offlineAdditionalCosts: {
		get: getItem(keys.offlineAdditionalCosts),
		set: setItem(keys.offlineAdditionalCosts),
		remove: removeItem(keys.offlineAdditionalCosts),
	},
}

export default StorageService
