import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as UserCreators } from 'src/ducks/user'
import AddTeam from './add-team'
import screens from 'src/constants/screens'
import Button from 'src/components/fw/button'
import ScreenHeader from 'src/components/fw/screen-header'

const User = ({ logout, navigation }) => {
	return (
		<View>
			<AddTeam />
			<Button
				onPress={() => {
					logout()
					navigation.navigate(screens.login)
				}}
				label={'Sair'}
			/>
		</View>
	)
}

User.navigationOptions = () => ({
	title: translate('menus.user'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapDispatchToProps = {
	logout: UserCreators.logout,
}

export default connect(
	null,
	mapDispatchToProps,
)(withNavigation(User))
