import React, { useEffect, useState } from 'react'
//import CompleteRegistration from '../../components/complete-registration'
import { connect } from 'react-redux'
import { View, Keyboard } from 'react-native'
import { withNavigation } from 'react-navigation'
import { userRoles } from 'src/constants/user-role'
import { Creators as UserCreators } from 'src/ducks/user'
import { Creators as TermsCreators } from 'src/ducks/terms'
import stacks from 'src/constants/stacks'
import screens from 'src/constants/screens'
import StorageService from 'src/services/storageService'
import KeyboardService from 'src/services/keyboardService'
import ToastService from 'src/services/toastService'

const Main = ({ logout, navigation, loadLoggedUser, checkTerms }) => {
	const [hasEmailRegistered, setHasEmailRegistered] = useState(false)
	const [hasRegistrationInProgress, setHasRegistrationInProgress] = useState(
		false,
	)

	// TODO do we need that executeActionBasedOnUrl that was here?
	const initialize = async () => {
		Keyboard.addListener('keyboardDidHide', KeyboardService.keyboardHide)

		// // TODO consider login
		// if (false /* has already logged as seller */) {
		// 	navigation.navigate(screens.login)
		// } else {
		// 	navigation.navigate(stacks.login)
		// }
		// return

		const user = await StorageService.user.get()
		const introduction = await StorageService.introduction.get()

		if (user) {
			await loadLoggedUser()

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
			return navigation.navigate(screens.orders)
			// }

			//setHasEmailRegistered(true)
			// } else if (introduction.read) {
			// 	navigation.navigate(screens.login)
		} else {
			// TODO ajustar para cair na tela certa de acordo com o login anteriormente feito
			navigation.navigate(screens.login)
			//navigation.navigate(screens.introduction)
		}
		navigation.navigate(screens.login)
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
	checkTerms: TermsCreators.check,
	loadLoggedUser: UserCreators.loadLoggedUser,
}

export default withNavigation(
	connect(
		null,
		mapDispatchToProps,
	)(Main),
)
