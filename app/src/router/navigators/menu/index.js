import React from 'react'
import { SvgXml } from 'react-native-svg'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import HomeStack from './items/home'
import UserStack from './items/user'
import SellStack from './items/sell'
import OrdersStack from './items/orders'
import StorageStack from './items/storage'
import svgHome from 'res/svgs/svgHome.svg'
import svgStorage from 'res/svgs/svgStorage.svg'
import svgHomeSelected from 'res/svgs/svgHomeSelected.svg'
import svgStorageSelected from 'res/svgs/svgStorageSelected.svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

HomeStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

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

SellStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

OrdersStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

UserStack.navigationOptions = () => ({
	tabBarIcon: ({ focused }) =>
		focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
	tabBarOptions: {
		showLabel: false,
		showIcon: true,
	},
})

const MenuNavigator = createBottomTabNavigator(
	{
		Home: HomeStack,
		Storage: StorageStack,
		Sell: SellStack,
		Orders: OrdersStack,
		User: UserStack,
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

export default MenuNavigator
