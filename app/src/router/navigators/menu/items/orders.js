import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import Orders from 'src/modules/menus/orders'
import colors from 'src/constants/colors'

const OrdersStack = createStackNavigator(
	{
		Orders,
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
