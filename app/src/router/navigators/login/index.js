import { createStackNavigator } from 'react-navigation-stack'
import Login from 'src/modules/login/main'
import LoginSelect from 'src/modules/login/select'

const LoginStack = createStackNavigator(
	{
		LoginSelect,
		Login,
	},
	{
		defaultNavigationOptions: () => ({
			headerShown: false,
		}),
	},
)

export default LoginStack
