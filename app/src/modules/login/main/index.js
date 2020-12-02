import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { TouchableOpacity, View } from 'react-native'
import { loginType } from 'src/constants/login-type'
import { Creators as UserCreators } from 'src/ducks/user'
import styles from './styles'
import colors from 'src/constants/colors'
import stacks from 'src/constants/stacks'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import svgLogo from 'res/svgs/v9/svgLogo.svg'
import svgBack from 'res/svgs/v9/svgBack.svg'
import Loader from 'src/components/fw/loader'
import ToastService from 'src/services/toastService'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import CheckBox from '@react-native-community/checkbox'
import StorageService from 'src/services/storageService'

const Login = ({ login, navigation, userId, accessToken, loading }) => {
	const [userText, setUserText] = useState('')
	const [passwordText, setPasswordText] = useState('')
	const [rememberMeCheck, setRememberMeCheck] = useState(false)

	const initialize = async () => {
		const rememberMe = await StorageService.rememberMe.get()
		if (rememberMe) {
			setRememberMeCheck(true)
			setUserText(rememberMe.userText)
			setPasswordText(rememberMe.passwordText)
		}
	}

	useEffect(() => {
		initialize()
	}, [])

	const handleLogin = async () => {
		const success = await login(userText, passwordText)
		if (success) {
			await StorageService.loginType.set(loginType.vendor)

			if (rememberMeCheck) {
				await StorageService.rememberMe.set({ userText, passwordText })
			} else {
				await StorageService.rememberMe.remove()
			}

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
				maxLength={50}
				value={userText}
				setValue={setUserText}
				label={translate('login.user')}
			/>
			<Space />
			<TextInput
				password
				maxLength={50}
				value={passwordText}
				setValue={setPasswordText}
				label={translate('login.password')}
			/>
			<View style={styles.row}>
				<KText text={translate('login.rememberMe')} />
				<CheckBox
					value={rememberMeCheck}
					style={styles.checkbox}
					onValueChange={checked => setRememberMeCheck(checked)}
				/>
			</View>
			<Space size2 />
			{loading ? (
				<Loader style={styles.loader} />
			) : (
				<Button onPress={handleLogin} label={translate('login.login')} />
			)}
		</ScreenBase>
	)
}

const mapStateToProps = ({ user }) => ({
	userId: user.id,
	loading: user.loading,
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
