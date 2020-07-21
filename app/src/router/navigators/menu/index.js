import React from 'react'
import { SvgXml } from 'react-native-svg'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import HomeStack from './items/home'
import svgHome from 'res/svgs/svgHome.svg'
import StorageStack from './items/storage'
import svgStorage from 'res/svgs/svgStorage.svg'
import svgHomeSelected from 'res/svgs/svgHomeSelected.svg'
import svgStorageSelected from 'res/svgs/svgStorageSelected.svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

StorageStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? (
			<SvgXml xml={svgStorageSelected} />
		) : (
			<SvgXml xml={svgStorage} />
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
	{ Storage: StorageStack, Home: HomeStack },
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
