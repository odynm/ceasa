import { createSwitchNavigator } from 'react-navigation'
import Main from 'src/modules/main'
import MenuNavigator from '../menu'
import Introduction from 'src/modules/introduction'

const AppNavigator = createSwitchNavigator({
	Main,
	Introduction,
	Menu: MenuNavigator,
})

export default AppNavigator
