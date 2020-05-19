import Register from 'src/modules/menus/register'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import { wp } from 'src/utils/screen'

const RegisterStack = createStackNavigator(
	{
		Register,
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

export default RegisterStack
