import React, { useRef, useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { onNavigationStateChange } from 'src/plugins/analytics'
import i18n from 'i18n-js'
import store from 'src/ducks'
import Toast from 'react-native-easy-toast'
import DeviceInfo from 'react-native-device-info'
import HttpService from 'src/services/httpService'
import MoneyService from 'src/services/moneyService'
import ToastService from 'src/services/toastService'
import Notifier from 'src/components/ceasa/notifier'
import Refresher from 'src/components/ceasa/refresher'
import messaging from '@react-native-firebase/messaging'
import AppContainer, { navigationRef } from 'src/router'
import StorageService from 'src/services/storageService'
import LocationService from 'src/services/locationService'
import InternetService from 'src/services/internetService'

const App = () => {
	const toastRef = useRef()
	const [appLoaded, setAppLoaded] = useState(false)

	useEffect(() => {
		initialize()
	}, [])

	const initialize = async () => {
		const hasInternetConnection = await InternetService.verifyInternet()
		if (!hasInternetConnection) {
			console.warn('No internet connection - no startup')
			return
		}

		// Reset refresher
		await StorageService.refresherRunning.set(false)

		HttpService.initialize(navigationRef, NavigationActions)
		MoneyService.initialize()
		ToastService.initialize(toastRef)

		await LocationService.initialize()
		i18n.locale = 'pt-BR' //TODO set according to location

		setAppLoaded(true)
	}

	return (
		<Provider store={store}>
			{appLoaded && (
				<>
					<Refresher />
					<Notifier />
					<AppContainer
						ref={navigationRef}
						onNavigationStateChange={onNavigationStateChange}
					/>
				</>
			)}
			<Toast ref={toastRef} />
		</Provider>
	)
}

export default App
