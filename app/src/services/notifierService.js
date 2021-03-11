import { Vibration } from 'react-native'
import { Creators as NotificationsCreators } from 'src/ducks/notifications'
import store from 'src/ducks'
import OneSignal from 'react-native-onesignal'
import DeviceInfo from 'react-native-device-info'
import notificationType from 'src/enums/notifications'
import messaging from '@react-native-firebase/messaging'

const start = () => {
	messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.warn('Message handled in the background!', remoteMessage)
		Vibration.vibrate()
		const data = fixObject(remoteMessage)?.data?.custom?.a
		switch (data?.type) {
			case 'edit':
				store.dispatch(
					NotificationsCreators.addNotification({
						type: notificationType.edited,
						open: true,
						content: fixObject(remoteMessage)?.data?.custom?.a,
					}),
				)
				break
			case 'delete':
				store.dispatch(
					NotificationsCreators.addNotification({
						type: notificationType.cancelation,
						open: true,
						content: fixObject(remoteMessage)?.data?.custom?.a,
					}),
				)
				break
			default:
				break
		}
	})

	messaging().onMessage(async remoteMessage => {
		console.warn('Foreground!', remoteMessage)
		Vibration.vibrate()
		const data = fixObject(remoteMessage)?.data?.custom?.a
		switch (data?.type) {
			case 'edit':
				store.dispatch(
					NotificationsCreators.addNotification({
						type: notificationType.edited,
						open: true,
						content: fixObject(remoteMessage)?.data?.custom?.a,
					}),
				)
				break
			case 'delete':
				store.dispatch(
					NotificationsCreators.addNotification({
						type: notificationType.cancelation,
						open: true,
						content: fixObject(remoteMessage)?.data?.custom?.a,
					}),
				)
				break
			default:
				break
		}
	})

	OneSignal.setLogLevel(6, 0)

	OneSignal.init('19e61978-2e9b-49f8-b19e-20ede4f22986', {
		kOSSettingsKeyAutoPrompt: false,
		kOSSettingsKeyInAppLaunchURL: false,
		kOSSettingsKeyInFocusDisplayOption: 2,
	})
	OneSignal.sendTag(DeviceInfo.getAndroidIdSync(), 'true')
	OneSignal.inFocusDisplaying(0)

	// OneSignal.addEventListener('received', onReceived)
	// OneSignal.addEventListener('opened', onOpened)
	// OneSignal.addEventListener('ids', onIds)

	// const onReceived = notification => {
	// 	store.dispatch(
	// 		NotificationsCreators.setCancelationModal({
	// 			open: true,
	// 			content: fixObject(notification.data),
	// 		}),
	// 	)
	// }

	// const onOpened = openResult => {
	// 	store.dispatch(
	// 		NotificationsCreators.setCancelationModal({
	// 			open: true,
	// 			content: fixObject(openResult.data),
	// 		}),
	// 	)
	// }

	// const onIds = device => {
	// 	console.log('Device info: ', device)
	// }
}

// Long story short, api returned deep objects as strings instead of objects
// This is a hack to fix it.
const fixObject = obj => {
	return JSON.parse(
		JSON.stringify(obj)
			.replace(/\"\{/g, '{')
			.replace(/\"\[/g, '[')
			.replace(/\}\"/g, '}')
			.replace(/\]\"/g, ']')
			.replace(/\\\"/g, '"'),
	)
}

const NotifierService = { start }

export default NotifierService
