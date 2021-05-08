import React, {useRef, useState, useEffect} from 'react'
import {Provider} from 'react-redux'
import {NavigationActions} from 'react-navigation'
import {onNavigationStateChange} from 'src/plugins/analytics'
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
import AppContainer, {navigationRef} from 'src/router'
import StorageService from 'src/services/storageService'
import LocationService from 'src/services/locationService'
import InternetService from 'src/services/internetService'
import KText from 'src/components/fw/ktext'
import {translate} from 'src/i18n/translate'
import KModal from 'src/components/fw/kmodal'

const App = () => {
    const toastRef = useRef()
    const [appLoaded, setAppLoaded] = useState(false)
    const [noInternet, setNoInternet] = useState(false)

    useEffect(() => {
        initialize()
    }, [])

    const initialize = async () => {
        i18n.locale = 'pt-BR' //TODO set according to location

        const hasInternetConnection = await InternetService.isInternetReachable()
        if (!hasInternetConnection) {
            console.warn('No internet connection - no startup')
            setNoInternet(true)

            // try again
            setTimeout(initialize, 2000)

            return
        } else {
            setNoInternet(false)
        }

        // Reset refresher
        await StorageService.refresherRunning.set(false)

        HttpService.initialize(navigationRef, NavigationActions)
        MoneyService.initialize()
        ToastService.initialize(toastRef)

        await LocationService.initialize()

        setAppLoaded(true)
    }

    return (
        <Provider store={store}>
            {noInternet ? (
                <KModal
                    noClose
                    size={250}
                    open={noInternet}
                    header={translate('app.noInternet')}>
                    <KText text={translate('app.noConnection')} />
                </KModal>
            ) : (
                <>
                    {appLoaded && (
                        <>
                            <Refresher />
                            <Notifier />
                            <AppContainer
                                ref={navigationRef}
                                onNavigationStateChange={
                                    onNavigationStateChange
                                }
                            />
                        </>
                    )}
                </>
            )}
            <Toast ref={toastRef} />
        </Provider>
    )
}

export default App
