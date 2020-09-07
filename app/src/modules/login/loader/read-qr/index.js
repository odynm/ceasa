import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { RNCamera } from 'react-native-camera'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import styles from './styles'
import Loader from 'src/components/fw/loader'
import ScreenHeader from 'src/components/fw/screen-header'
//import { wp, hp } from 'src/utils/screen'
//import SvgXml from 'react-native-svg'
//import xmlQrScanBorder from 'res/svgs/qr-scan-border.svg'

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
				<View style={styles.container}>
					<RNCamera
						type={'front'}
						captureAudio={false}
						style={styles.camera}
						onGoogleVisionBarcodesDetected={handleRead}
					/>
					<View style={[styles.overlay, styles.top]} />
					<View style={[styles.overlay, styles.left]} />
					<View style={[styles.overlay, styles.right]} />
					<View style={[styles.overlay, styles.bottom]} />
					{/* <SvgXml
						xml={xmlQrScanBorder}
						style={styles.middleArea}
						width={wp(250)}
						height={hp(250)}
					/> */}
				</View>
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
