import screens from 'src/constants/screens'
// import ToastService from '../../../services/toast.service'
// import { translate } from '../../../i18n'
// import { isLoggedIn } from '../../../utils/user'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import HomeStack from './items/home'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

const MenuNavigator = createBottomTabNavigator(
	{ Home: HomeStack },
	{
		backBehavior: 'history',
		defaultNavigationOptions: () => ({
			tabBarOnLongPress: () => 0,
			tabBarOnPress: ({ defaultHandler, ...props }) => {
				if (/*isLoggedIn()*/ true) {
					return defaultHandler()
				}

				const nextRoute = props.navigation.state.key
				const isValidRoute = enabledRoutesForAnonymous.includes(nextRoute)

				if (isValidRoute) {
					defaultHandler()
				} else {
					//ToastService.show({ message: translate('app.menuUnavailable') })
				}
			},
		}),
	},
)

export default MenuNavigator
