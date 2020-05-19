import React, { useRef, useState, useEffect } from 'react'
import AppContainer, { navigationRef } from 'src/router'
import HttpService from 'src/services/httpService'
import ToastService from 'src/services/toastService'
import LocationService from 'src/services/locationService'
import InternetService from 'src/services/internetService'
import { Provider } from 'react-redux'
import Toast from 'react-native-easy-toast'
import { onNavigationStateChange } from 'src/plugins/analytics'
import i18n from 'i18n-js'
import store from 'src/ducks'

const App = () => {
	const toastRef = useRef()
	const [appLoaded, setAppLoaded] = useState(false)

	useEffect(() => {
		initialize()
	}, [])

	const initialize = async () => {
		const hasInternetConnection = await InternetService.verifyInternet()
		if (!hasInternetConnection) {
			return
		}

		HttpService.initialize()
		ToastService.initialize()

		await LocationService.initialize()
		i18n.locale = 'pt-BR' //TODO set according to location

		setAppLoaded(true)
	}

	return (
		<Provider store={store}>
			{appLoaded && (
				<AppContainer
					ref={navigationRef}
					onNavigationStateChange={onNavigationStateChange}
				/>
			)}
			<Toast ref={toastRef} />
		</Provider>
	)
}

export default App
