import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import Orders from 'src/modules/menus/orders'
import EditOrder from 'src/modules/menus/orders/edit-order'

const OrdersStack = createStackNavigator(
	{
		Orders,
		EditOrder,
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
