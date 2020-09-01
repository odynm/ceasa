import React from 'react'
import { SvgXml } from 'react-native-svg'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import OrdersLoaderStack from './items/orders'
import CarryingLoaderStack from './items/carrying'
import svgHome from 'res/svgs/svgHome.svg'
import svgHomeSelected from 'res/svgs/svgHomeSelected.svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

OrdersLoaderStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

CarryingLoaderStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

const LoaderMenuNavigator = createBottomTabNavigator(
	{
		Orders: OrdersLoaderStack,
		Carrying: CarryingLoaderStack,
	},
	{
		backBehavior: 'history',
		defaultNavigationOptions: () => ({
			tabBarOnLongPress: () => 0,
			tabBarOnPress: ({ defaultHandler, ...props }) => {
				//TODO what is this exactly?
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

export default LoaderMenuNavigator
