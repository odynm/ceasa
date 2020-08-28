import React, { useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import Loader from 'src/components/fw/loader'
import QRCodeScanner from 'react-native-qrcode-scanner'
import ScreenHeader from 'src/components/fw/screen-header'

const ReadQr = ({ navigation, joinTeam, loadLoaderTeams }) => {
	const [loading, setLoading] = useState(false)

	const handleRead = async e => {
		const code = e.data
		setLoading(true)
		await joinTeam(code)
		setLoading(false)

		loadLoaderTeams()
		navigation.goBack(null)
	}

	return (
		<>
			{loading ? (
				<Loader fullScreen />
			) : (
				<QRCodeScanner cameraType={'front'} onRead={handleRead} />
			)}
		</>
	)
}

ReadQr.navigationOptions = () => ({
	title: translate('loaderLogin.login'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {
	joinTeam: TeamCreators.joinTeam,
	loadLoaderTeams: TeamCreators.loadLoaderTeams,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(ReadQr))
