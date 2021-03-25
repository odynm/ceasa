import { wp } from 'src/utils/screen'
import { createStackNavigator } from 'react-navigation-stack'
import colors from 'src/constants/colors'
import ReadQr from 'src/modules/login/loader/read-qr'
import LoaderEdit from 'src/modules/login/loader/edit'
import WriteQr from 'src/modules/login/loader/write-qr'
import LoaderTeams from 'src/modules/login/loader/teams'

const LoginLoaderTeamStack = createStackNavigator(
	{
		LoaderTeams,
		ReadQr,
		WriteQr,
		LoaderEdit,
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
