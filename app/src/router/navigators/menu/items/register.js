import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import Register from 'src/modules/menus/register'

const RegisterStack = createStackNavigator(
	{
		Register,
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

export default RegisterStack
