import Main from 'src/modules/main'
import Introduction from 'src/modules/introduction'

import { createSwitchNavigator } from 'react-navigation'
import MenuNavigator from '../menu'

const AppNavigator = createSwitchNavigator({
	Main,
	Introduction,
	Menu: MenuNavigator,
})

export default AppNavigator
