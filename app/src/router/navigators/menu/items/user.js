import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import User from 'src/modules/menus/user'
import colors from 'src/constants/colors'

const UserStack = createStackNavigator(
	{
		User,
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

export default UserStack
