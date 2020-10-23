import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import screens from 'src/constants/screens'
import KText from 'src/components/fw/ktext'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const LoadersTeam = ({ navigation }) => {
	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<View style={{ alignItems: 'center' }}>
				<KText text={translate('user.loadersTeam.noLoaders')} />
				<Button
					onPress={() => {
						navigation.navigate(screens.addLoader)
					}}
					label={translate('user.addLoader.title')}
				/>
			</View>
		</ScreenBase>
	)
}

LoadersTeam.navigationOptions = () => ({
	title: translate('user.loadersTeam.title'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {}

export default connect(
	null,
	mapDispatchToProps,
)(withNavigation(LoadersTeam))
