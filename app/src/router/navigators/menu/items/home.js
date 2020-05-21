import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import Home from 'src/modules/menus/home'
import colors from 'src/constants/colors'

const HomeStack = createStackNavigator(
	{
		Home,
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

export default HomeStack
