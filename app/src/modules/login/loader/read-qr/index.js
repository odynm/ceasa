import React, { useState, useRef } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { RNCamera } from 'react-native-camera'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import styles from './styles'
import Loader from 'src/components/fw/loader'
import ToastService from 'src/services/toastService'
import ScreenHeader from 'src/components/fw/screen-header'
//import { wp, hp } from 'src/utils/screen'
//import SvgXml from 'react-native-svg'
//import xmlQrScanBorder from 'res/svgs/v12/qr-scan-border.svg'

const ReadQr = ({ navigation, joinTeam, loadLoaderTeams }) => {
	const camRef = useRef(null)
	const [handling, setHandling] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleRead = async e => {
		if (handling) {
			return
		}
		setHandling(true)
		const validBarcodes = e.barcodes.filter(x => x.type === 'QR_CODE')
		if (validBarcodes.length > 0) {
			const code = validBarcodes[0].data
			if (code && code.length > 1) {
				setLoading(true)
				await joinTeam(code)
				setLoading(false)

				await loadLoaderTeams()
				navigation.goBack(null)
			} else {
				ToastService.show({
					message: translate('loaderTeams.readFail'),
					duration: 2000,
				})
			}
		}
		setHandling(false)
	}

	return (
		<>
			{loading ? (
				<Loader fullScreen />
			) : (
				<View style={styles.container}>
					<RNCamera
						ref={camRef}
						type={'back'}
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
	title: translate('loaderMenus.join'),
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
