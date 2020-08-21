import React, { useState } from 'react'
import { connect } from 'react-redux'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as UserCreators } from 'src/ducks/user'
import styles from './styles'
import colors from 'src/constants/colors'
import stacks from 'src/constants/stacks'
import svgBack from 'res/svgs/svgBack.svg'
import svgLogo from 'res/svgs/svgLogo.svg'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import ToastService from 'src/services/toastService'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'

const Login = ({ login, navigation, userId, accessToken }) => {
	const [userText, setUserText] = useState('')
	const [passwordText, setPasswordText] = useState('')

	const handleLogin = async () => {
		const success = await login(userText, passwordText)
		if (success) {
			navigation.navigate(stacks.menu)
		} else {
			ToastService.show({ message: translate('login.error') })
		}
	}

	const handlePress = async () => {
		navigation.goBack(null)
	}

	return (
		<ScreenBase>
			<TouchableOpacity
				activeOpacity={0.3}
				style={styles.backButton}
				onPress={handlePress}>
				<SvgXml
					xml={svgBack}
					stroke={colors.primary}
					strokeWidth="5"
					strokeLinejoin={'round'}
					strokeLinecap={'round'}
				/>
			</TouchableOpacity>
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
