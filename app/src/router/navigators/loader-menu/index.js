import React from 'react'
import { SvgXml } from 'react-native-svg'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import svgHome from 'res/svgs/v5/svgHome.svg'
import svgUser from 'res/svgs/v5/svgUser.svg'
import OrdersLoaderStack from './items/orders'
import OptionsLoaderStack from './items/options'
import svgOrders from 'res/svgs/v5/svgOrders.svg'
import CarryingLoaderStack from './items/carrying'
import svgHomeSelected from 'res/svgs/v5/svgHomeSelected.svg'
import svgUserSelected from 'res/svgs/v5/svgUserSelected.svg'
import svgOrdersSelected from 'res/svgs/v5/svgOrdersSelected.svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

OrdersLoaderStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgOrdersSelected} /> : <SvgXml xml={svgOrders} />,
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

OptionsLoaderStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgUserSelected} /> : <SvgXml xml={svgUser} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

const LoaderMenuNavigator = createBottomTabNavigator(
	{
		Orders: OrdersLoaderStack,
		Carrying: CarryingLoaderStack,
		Options: OptionsLoaderStack,
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
