import React from 'react'
// import ToastService from '../../../services/toast.service'
// import { translate } from '../../../i18n'
// import { isLoggedIn } from '../../../utils/user'
import { SvgXml } from 'react-native-svg'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import HomeStack from './items/home'
import screens from 'src/constants/screens'
import RegisterStack from './items/register'
import svgHome from '../../../../res/svgs/svgHome.svg'
import svgRegister from '../../../../res/svgs/svgRegister.svg'
import svgHomeSelected from '../../../../res/svgs/svgHomeSelected.svg'
import svgRegisterSelected from '../../../../res/svgs/svgRegisterSelected.svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

RegisterStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? (
			<SvgXml xml={svgRegisterSelected} />
		) : (
			<SvgXml xml={svgRegister} />
		),
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

HomeStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

const MenuNavigator = createBottomTabNavigator(
	{ Register: RegisterStack, Home: HomeStack },
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
