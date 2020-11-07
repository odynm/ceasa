import store from 'src/ducks'
import messaging, { firebase } from '@react-native-firebase/messaging'
import { Creators as NotificationsCreators } from 'src/ducks/notifications'

const start = () => {
	const localNotification = new firebase.notifications.Notification({
		show_in_foreground: true,
		sound: 'default',
	})
	//.android
	// 	.setChannelId('com.alinamed.app.default_channel_id')
	// 	.android.setVibrate([1000, 1000])
	// 	.android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
	// 	.android.setPriority(firebase.notifications.Android.Priority.High)
	// 	.android.setSmallIcon('ic_launcher')
	// 	.android.setVibrate(1000)
	// // .setNotificationId(message.messageId)
	// // .setTitle(payload.sender.name)
	// // .setSubtitle(`Belum dibaca: ${payload.unread_message_count}`)
	// // .setBody(text)
	// // .setData(payload)
	// // .setSound('default')

	// messaging()
	// 	.getToken()
	// 	.then(a => console.warn(a))

	messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.warn('Message handled in the background!', remoteMessage)
		store.dispatch(
			NotificationsCreators.setCancelationModal({
				open: true,
				content: fixObject(remoteMessage.data),
			}),
		)
	})

	messaging().onMessage(async remoteMessage => {
		console.warn('Foreground!', remoteMessage)
		console.warn(remoteMessage.data)
		store.dispatch(
			NotificationsCreators.setCancelationModal({
				open: true,
				content: fixObject(remoteMessage.data),
			}),
		)
	})
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
