// import config from 'src/config'
// import store from 'src/ducks'
// import { Creators as AppCreators } from 'src/ducks/app'
// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge'
// import { Creators as NavigationCreators } from 'src/ducks/navigation'

// export const tracker = new GoogleAnalyticsTracker(config.GA_TRACKING_ID)

// // export const trackEvent = (category, action) => {
// // 	return tracker.trackEvent(category, action)
// // }

// const getCurrentRouteName = (navigationState) => {
// 	if (!navigationState) {
// 		return null
// 	}

// 	const route = navigationState.routes[navigationState.index]
// 	if (route.routes) {
// 		return getCurrentRouteName(route)
// 	}

// 	return route.routeName
// }

// export const onNavigationStateChange = (prevState, currentState) => {
// 	const currentScreen = getCurrentRouteName(currentState)
// 	const prevScreen = getCurrentRouteName(prevState)

// 	if (prevScreen !== currentScreen) {
// 		store.dispatch(NavigationCreators.setCurrentScreen(currentScreen))
// 		tracker.trackScreenView(currentScreen)
// 		store.dispatch(AppCreators.setCurrentScreen(currentScreen))
// 	}
// }
