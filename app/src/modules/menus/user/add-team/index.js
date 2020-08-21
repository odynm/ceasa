import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as TeamCreators } from 'src/ducks/team'
import QRCode from 'react-native-qrcode-svg'
import ScreenHeader from 'src/components/fw/screen-header'

const AddTeam = ({ teamCode, loading, loadTeamCode }) => {
	useEffect(() => {
		loadTeamCode()
	}, [])

	return (
		<View>
			{teamCode && teamCode.length > 0 ? (
				<QRCode value={teamCode} size={300} />
			) : (
				undefined
			)}
		</View>
	)
}

AddTeam.navigationOptions = () => ({
	title: translate('menus.user'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapStateToProps = ({ team }) => ({
	teamCode: team.teamCode,
})

const mapDispatchToProps = {
	loadTeamCode: TeamCreators.loadTeamCode,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddTeam)
