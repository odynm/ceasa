import React, { useEffect, useState } from 'react'
//import CompleteRegistration from '../../components/complete-registration'
import { connect } from 'react-redux'
import { View, Keyboard } from 'react-native'
import { withNavigation } from 'react-navigation'
import { userRoles } from 'src/constants/user-role'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as UserCreators } from 'src/ducks/user'
import { Creators as TermsCreators } from 'src/ducks/terms'
import stacks from 'src/constants/stacks'
import screens from 'src/constants/screens'
import StorageService from 'src/services/storageService'
import KeyboardService from 'src/services/keyboardService'
import ToastService from 'src/services/toastService'
import rfdc from 'rfdc'
import { loginType } from 'src/constants/login-type'
import RNLocalize from 'react-native-localize'

const Main = ({
	logout,
	navigation,
	setTimezone,
	loadLoggedUser,
	loadOrders,
	checkTerms,
}) => {
	//const [hasStartedRefresher, setHasStartedRefresher] = useState(false)
	const [hasEmailRegistered, setHasEmailRegistered] = useState(false)
	const [hasRegistrationInProgress, setHasRegistrationInProgress] = useState(
		false,
	)

	// TODO do we need that executeActionBasedOnUrl that was here?
	const initialize = async () => {
		Keyboard.addListener('keyboardDidHide', KeyboardService.keyboardHide)

		setTimezone(RNLocalize.getTimeZone())

		// // TODO consider login
		// if (false /* has already logged as seller */) {
		// 	navigation.navigate(screens.login)
		// } else {
		// 	navigation.navigate(stacks.login)
		// }
		// return

		// Always logout when close app
		//const user = await StorageService.user.get()

		// const accepted = await checkTerms()
		// if (!accepted) {
		// 	return navigation.navigate(screens.terms)
		// }

		// setHasRegistrationInProgress(
		// 	(await StorageService.registrationsInProgress.get([])).includes(
		// 		user.id,
		// 	),
		// )
		// const regularRegistration = Object.values(userRoles).includes(
		// 	user.userType,
		// )

		// if (regularRegistration && !hasRegistrationInProgress) {
		// }

		//setHasEmailRegistered(true)
		// } else if (introduction.read) {
		// 	navigation.navigate(screens.login)
		// TODO ajustar para cair na tela certa de acordo com o login anteriormente feito

		switch (await StorageService.loginType.get()) {
			case loginType.loader:
				navigation.navigate(screens.loginLoader)
				break
			case loginType.vendor:
				navigation.navigate(screens.login)
				break
			default:
				navigation.navigate(screens.loginSelect)
				break
		}
		//navigation.navigate(screens.introduction)
	}

	useEffect(() => {
		initialize()
	}, [])

	const onPressCancel = async () => {
		await logout()
		navigation.navigate(screens.login)
	}

	const onPressContinue = () => {
		if (hasRegistrationInProgress) {
			navigation.navigate(screens.registerLegalPersonInfos)
		} else {
			navigation.navigate(screens.changeProfile)
		}
	}

	return (
		hasEmailRegistered && (
			<View />
			// <CompleteRegistration
			// 	onAccept={onPressContinue}
			// 	onDecline={onPressCancel}
			// />
		)
	)
}

const mapDispatchToProps = {
	logout: UserCreators.logout,
	setTimezone: AppCreators.setTimezone,
	loadLoggedUser: UserCreators.loadLoggedUser,
}

export default withNavigation(
	connect(
		null,
		mapDispatchToProps,
	)(Main),
)
