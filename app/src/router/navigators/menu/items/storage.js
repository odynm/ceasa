import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import Storage from 'src/modules/menus/storage'

const StorageStack = createStackNavigator(
	{
		Storage,
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

export default StorageStack
