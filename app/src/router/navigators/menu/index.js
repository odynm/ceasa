import React from 'react'
import {SvgXml} from 'react-native-svg'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import HomeStack from './items/home'
import UserStack from './items/user'
import SellStack from './items/sell'
import OrdersStack from './items/orders'
import StorageStack from './items/storage'
import svgHome from 'res/svgs/v12/svgHome.svg'
import svgUser from 'res/svgs/v12/svgUser.svg'
import svgSell from 'res/svgs/v12/svgSell.svg'
import svgOrders from 'res/svgs/v12/svgOrders.svg'
import svgStorage from 'res/svgs/v12/svgStorage.svg'
//import svgHomeSelected from '../../../../res/svgs/svgHomeSelected.svg'
import svgHomeSelected from 'res/svgs/v12/svgHomeSelected.svg'
import svgSellSelected from 'res/svgs/v12/svgSellSelected.svg'
import svgUserSelected from 'res/svgs/v12/svgUserSelected.svg'
import svgOrdersSelected from 'res/svgs/v12/svgOrdersSelected.svg'
import svgStorageSelected from 'res/svgs/v12/svgStorageSelected.svg'

//const enabledRoutesForAnonymous = [screens.home, screens.search]

HomeStack.navigationOptions = () => ({
    tabBarIcon: ({focused}) =>
        focused ? <SvgXml xml={svgHomeSelected} /> : <SvgXml xml={svgHome} />,
    tabBarOptions: {
        showLabel: false,
        showIcon: true,
    },
})

StorageStack.navigationOptions = () => ({
    tabBarIcon: ({focused}) =>
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
    tabBarIcon: ({focused}) =>
        focused ? <SvgXml xml={svgSellSelected} /> : <SvgXml xml={svgSell} />,
    tabBarOptions: {
        showLabel: false,
        showIcon: true,
    },
})

OrdersStack.navigationOptions = () => ({
    tabBarIcon: ({focused}) =>
        focused ? (
            <SvgXml xml={svgOrdersSelected} />
        ) : (
            <SvgXml xml={svgOrders} />
        ),
    tabBarOptions: {
        showLabel: false,
        showIcon: true,
    },
})

UserStack.navigationOptions = () => ({
    tabBarIcon: ({focused}) =>
        focused ? <SvgXml xml={svgUserSelected} /> : <SvgXml xml={svgUser} />,
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
            tabBarOnPress: ({defaultHandler, ...props}) => {
                //TODO what is this exactly?
                if (/*isLoggedIn()*/ true) {
                    return defaultHandler()
                }

                const nextRoute = props.navigation.state.key
                const isValidRoute = enabledRoutesForAnonymous.includes(
                    nextRoute,
                )

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
