import React, { useState, useEffect } from 'react'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import styles from './styles'
import svgLogo from 'res/svgs/svgLogo.svg'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import { Creators as UserCreators } from 'src/ducks/user'
import { connect } from 'react-redux'
import stacks from 'src/constants/stacks'

const Login = ({ login, navigation, userId, accessToken }) => {
	const [userText, setUserText] = useState('')
	const [passwordText, setPasswordText] = useState('')

	const handleLogin = async () => {
		await login(userText, passwordText)
		navigation.navigate(stacks.menu)
	}

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
			<Button onPress={handleLogin} label={translate('login.login')} />
		</ScreenBase>
	)
}

const mapStateToProps = ({ user }) => ({
	userId: user.id,
	accessToken: user.accessToken,
})

const mapDispatchToProps = {
	login: UserCreators.login,
}

export default withNavigation(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(Login),
)
