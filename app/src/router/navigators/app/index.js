import { createSwitchNavigator } from 'react-navigation'
import Main from 'src/modules/main'
import MenuNavigator from '../menu'
import TestScreen from 'src/modules/_test'
import LoaderMenuNavigator from '../loader-menu'
import Introduction from 'src/modules/introduction'
import LoginVendorStack from '../login/login-vendor'
import LoginLoaderStack from '../login/login-loader'
import LoginLoaderTeamStack from '../login/login-loader-team'

const AppNavigator = createSwitchNavigator({
	Main,
	LoginVendorStack,
	LoginLoaderStack,
	LoginLoaderTeamStack,
	Introduction,
	Menu: MenuNavigator,
	LoaderMenu: LoaderMenuNavigator,
	TestScreen,
})

export default AppNavigator
