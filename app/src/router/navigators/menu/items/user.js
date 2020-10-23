import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import User from 'src/modules/menus/user'
import colors from 'src/constants/colors'
import AddLoader from 'src/modules/menus/user/add-loader'
import LoadersTeam from 'src/modules/menus/user/loaders-team'

const UserStack = createStackNavigator(
	{
		User,
		LoadersTeam,
		AddLoader,
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
