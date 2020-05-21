import React from 'react'
import { translate } from 'src/i18n/translate'
import Picker from 'src/components/fw/pickers/picker'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const Register = () => {
	return (
		<ScreenBase>
			<Picker label={translate('register.product')} />
		</ScreenBase>
	)
}

Register.navigationOptions = () => ({
	title: translate('menus.register'),
	headerLeft: props => <ScreenHeader {...props} />,
})

export default Register
