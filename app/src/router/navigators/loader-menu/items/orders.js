import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import OrdersLoader from 'src/modules/loader-modules/menus/orders'
import LoaderOrderInfo from 'src/modules/loader-modules/menus/orders/order-info'

const OrdersStack = createStackNavigator(
	{
		OrdersLoader,
		LoaderOrderInfo,
	},
	{
		defaultNavigationOptions: () => ({
			headerTitleStyle: {
				color: colors.primary,
				fontFamily: 'NotoSansBengaliUI-Bold',
			},
			headerTitleContainerStyle: {
				left: wp(60),
			},
		}),
	},
)

export default OrdersStack
