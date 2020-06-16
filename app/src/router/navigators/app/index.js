import { createSwitchNavigator } from 'react-navigation'
import LoginStack from '../login'
import Main from 'src/modules/main'
import MenuNavigator from '../menu'
import Introduction from 'src/modules/introduction'

const AppNavigator = createSwitchNavigator({
	Main,
	LoginStack,
	Introduction,
	Menu: MenuNavigator,
})

export default AppNavigator
