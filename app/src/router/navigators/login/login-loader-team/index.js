import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import ReadQr from 'src/modules/login/loader/read-qr'
import LoaderTeams from 'src/modules/login/loader/teams'

const LoginLoaderTeamStack = createStackNavigator(
	{
		LoaderTeams,
		ReadQr,
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

export default LoginLoaderTeamStack
