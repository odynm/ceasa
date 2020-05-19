import Home from 'src/modules/home'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import { wp } from 'src/utils/screen'

const HomeStack = createStackNavigator(
	{
		Home,
	},
	{
		defaultNavigationOptions: () => ({
			headerTitleStyle: {
				color: colors.primary,
			},
			headerTitleContainerStyle: {
				left: wp(60),
			},
		}),
	},
)

export default HomeStack
