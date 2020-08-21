import { createSwitchNavigator } from 'react-navigation'
import Main from 'src/modules/main'
import MenuNavigator from '../menu'
import TestScreen from 'src/modules/_test'
import Introduction from 'src/modules/introduction'
import LoginVendorStack from '../login/login-vendor'
import LoginLoaderStack from '../login/login-loader'

const AppNavigator = createSwitchNavigator({
	Main,
	LoginVendorStack,
	LoginLoaderStack,
	Introduction,
	Menu: MenuNavigator,
	TestScreen,
})

export default AppNavigator
