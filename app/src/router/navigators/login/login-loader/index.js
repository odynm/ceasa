import { createStackNavigator } from 'react-navigation-stack'
import LoginLoader from 'src/modules/login/loader'
import LoginSelect from 'src/modules/login/select'

const LoginLoaderStack = createStackNavigator(
	{
		LoginSelect,
		LoginLoader,
	},
	{
		defaultNavigationOptions: () => ({
			headerShown: false,
		}),
	},
)

export default LoginLoaderStack
