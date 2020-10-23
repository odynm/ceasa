import React from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import AddTeam from './add-team'
import KText from 'src/components/fw/ktext'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const AddLoader = () => {
	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<View
				style={{
					alignItems: 'center',
				}}>
				<Text>
					<KText text={translate('user.addLoader.instructions.1')} />
					<KText bold text={translate('user.addLoader.instructions.2')} />
					<KText text={translate('user.addLoader.instructions.3')} />
					<KText text={translate('user.addLoader.instructions.4')} />
					<KText text={translate('user.addLoader.instructions.5')} />
				</Text>
				<AddTeam />
			</View>
		</ScreenBase>
	)
}

AddLoader.navigationOptions = () => ({
	title: translate('user.addLoader.title'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {}

export default connect(
	null,
	mapDispatchToProps,
)(withNavigation(AddLoader))
