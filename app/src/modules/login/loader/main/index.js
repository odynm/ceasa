import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as LoaderCreators } from 'src/ducks/loader'
import styles from './styles'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import screens from 'src/constants/screens'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const LoginLoader = ({ login, loading, create, navigation }) => {
	const [nameInput, setNameInput] = useState('')
	const [nameError, setNameError] = useState('')

	useEffect(() => {
		tryLogin()
	}, [])

	const tryLogin = async () => {
		const success = await login()
		if (success) {
			navigation.navigate(screens.loaderTeams)
		}
	}

	const handleCreate = async () => {
		setNameError('')
		if (nameInput.length > 2) {
			await create(nameInput)
			await tryLogin()
		} else {
			setNameError(translate('loaderLogin.nameRequired'))
		}
	}

	return (
		<>
			{loading ? (
				<Loader fullScreen />
			) : (
				<ScreenBase>
					<KText
						bold
						fontSize={24}
						text={translate('loaderLogin.createTitle')}
					/>
					<Space />
					<KText text={translate('loaderLogin.createText')} />
					<Space size2 />
					<TextInput
						value={nameInput}
						maxLength={50}
						setValue={setNameInput}
						errorMessage={nameError}
						label={translate('loaderLogin.name')}
					/>
					<Button
						style={styles.button}
						onPress={handleCreate}
						label={translate('loaderLogin.loginButton')}
					/>
				</ScreenBase>
			)}
		</>
	)
}

LoginLoader.navigationOptions = () => ({
	title: translate('loaderLogin.login'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({ loader }) => ({
	loading: loader.loading,
})

const mapDispatchToProps = {
	login: LoaderCreators.login,
	create: LoaderCreators.create,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(LoginLoader))
