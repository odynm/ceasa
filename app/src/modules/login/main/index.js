import React, { useState } from 'react'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import styles from './styles'
import svgLogo from 'res/svgs/svgLogo.svg'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'

const Login = () => {
	const [userText, setUserText] = useState('')
	const [passwordText, setPasswordText] = useState('')

	return (
		<ScreenBase>
			<SvgXml style={styles.logo} xml={svgLogo} />
			<TextInput
				value={userText}
				setValue={setUserText}
				label={translate('login.user')}
			/>
			<Space />
			<TextInput
				password
				value={passwordText}
				setValue={setPasswordText}
				label={translate('login.password')}
			/>
			<Space size2 />
			<Button label={translate('login.login')} />
		</ScreenBase>
	)
}

export default withNavigation(Login)
