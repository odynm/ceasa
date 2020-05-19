import React from 'react'
import screens from 'src/constants/screens'
// import ToastService from '../../../services/toast.service'
// import { translate } from '../../../i18n'
// import { isLoggedIn } from '../../../utils/user'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import HomeStack from './items/home'
import RegisterStack from './items/register'

import svgHome from '../../../../res/svgs/svgHome.svg'
import svgHomeSelected from '../../../../res/svgs/svgHomeSelected.svg'
import { SvgXml } from 'react-native-svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

HomeStack.navigationOptions = () => ({
	tabBarLabel: 'Visão Geral',
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

RegisterStack.navigationOptions = () => ({
	tabBarLabel: 'Visão Geral',
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

const MenuNavigator = createBottomTabNavigator(
	{ Home: HomeStack, Register: RegisterStack },
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
