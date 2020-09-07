import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import screens from 'src/constants/screens'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'

const OptionsLoader = ({ navigation }) => {
	useEffect(() => {}, [])

	return (
		<View>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<Button
					label={translate('optionsLoader.logout')}
					onPress={() => {
						navigation.navigate(screens.loaderTeams)
					}}
				/>
			</ScreenBase>
		</View>
	)
}

const mapDispatchToProps = {}

const mapStateToProps = ({}) => ({})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(OptionsLoader))
