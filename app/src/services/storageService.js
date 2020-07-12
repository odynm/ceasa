import AsyncStorage from '@react-native-community/async-storage'

const setItem = key => async item => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(item))
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
	introduction: 'introduction',
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
}

export default StorageService
