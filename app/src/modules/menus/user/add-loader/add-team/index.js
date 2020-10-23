import React, { useEffect } from 'react'
import { hp } from 'src/utils/screen'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { StyleSheet, View } from 'react-native'
import { Creators as TeamCreators } from 'src/ducks/team'
import Loader from 'src/components/fw/loader'
import QRCode from 'react-native-qrcode-svg'
import ScreenHeader from 'src/components/fw/screen-header'

const AddTeam = ({ teamCode, loading, loadTeamCode, noConnection }) => {
	useEffect(() => {
		if (!noConnection) {
			loadTeamCode()
		}
	}, [noConnection])

	return (
		<View style={styles.qrCodeBounds}>
			{loading ? (
				<Loader />
			) : teamCode && teamCode.length > 0 ? (
				<QRCode value={teamCode} size={300} />
			) : (
				undefined
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	qrCodeBounds: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginVertical: hp(20),
	},
})

AddTeam.navigationOptions = () => ({
	title: translate('menus.user'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapStateToProps = ({ app, team }) => ({
	teamCode: team.teamCode,
	noConnection: app.noConnection,
})

const mapDispatchToProps = {
	loadTeamCode: TeamCreators.loadTeamCode,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddTeam)
