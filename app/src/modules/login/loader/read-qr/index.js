import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import QRCodeScanner from 'react-native-qrcode-scanner'
import ScreenHeader from 'src/components/fw/screen-header'

const ReadQr = ({ navigation, loadLoaderTeams }) => {
	const handleRead = e => {
		const code = e.data
		console.warn(code)
		loadLoaderTeams()
		navigation.goBack(null)
	}

	return <QRCodeScanner cameraType={'front'} onRead={handleRead} />
}

ReadQr.navigationOptions = () => ({
	title: translate('loaderLogin.login'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {
	loadLoaderTeams: TeamCreators.loadLoaderTeams,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(ReadQr))
