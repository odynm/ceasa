import { createSwitchNavigator } from 'react-navigation'
import LoginStack from '../login'
import Main from 'src/modules/main'
import MenuNavigator from '../menu'
import TestScreen from 'src/modules/_test'
import Introduction from 'src/modules/introduction'

const AppNavigator = createSwitchNavigator({
	Main,
	LoginStack,
	Introduction,
	Menu: MenuNavigator,
	TestScreen,
})

export default AppNavigator
