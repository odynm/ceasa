import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as UserCreators } from 'src/ducks/user'
import styles from './styles'
import config from 'src/config'
import KText from 'src/components/fw/ktext'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const User = ({ logout, navigation }) => {
	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<View>
				<Button
					onPress={() => {
						navigation.navigate(screens.loadersTeam)
					}}
					label={translate('user.loadersTeam.title')}
				/>
				<Space size4 />
				<Button
					onPress={() => {
						logout()
						navigation.navigate(screens.login)
					}}
					label={translate('user.logout')}
				/>
			</View>
			<KText style={styles.version} text={`Versão: ${config.VERSION}`} />
		</ScreenBase>
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
