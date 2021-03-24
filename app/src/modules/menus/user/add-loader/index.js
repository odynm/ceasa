import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import styles from './styles'
import AddTeam from './add-team'
import KText from 'src/components/fw/ktext'
import KModal from 'src/components/fw/kmodal'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const AddLoader = ({ teamCode, loadTeamCode, loadingQrCode }) => {
	const [showInstructions, setShowInstructions] = useState(false)

	useEffect(() => {
		loadTeamCode()
	}, [])

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<View style={styles.alignCenter}>
				<Button
					small
					label={translate('user.addLoader.instructions.header')}
					onPress={() => setShowInstructions(true)}
				/>
				<KText
					bold
					fontSize={28}
					style={styles.codeText}
					text={`${translate('user.addLoader.code')} ${teamCode}`}
				/>
				<AddTeam teamCode={teamCode} loading={loadingQrCode} />
			</View>
			<KModal
				size={400}
				open={showInstructions}
				onClose={() => {
					setShowInstructions(false)
				}}
				header={translate('user.addLoader.instructions.title')}>
				<Text>
					<KText text={translate('user.addLoader.instructions.1')} />
					<KText bold text={translate('user.addLoader.instructions.2')} />
					<KText text={translate('user.addLoader.instructions.3')} />
					<KText text={translate('user.addLoader.instructions.4')} />
					<KText text={translate('user.addLoader.instructions.5')} />
				</Text>
			</KModal>
		</ScreenBase>
	)
}

AddLoader.navigationOptions = () => ({
	title: translate('user.addLoader.title'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({ team }) => ({
	teamCode: team.teamCode,
	loadingQrCode: team.loading,
})

const mapDispatchToProps = {
	loadTeamCode: TeamCreators.loadTeamCode,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(AddLoader))
