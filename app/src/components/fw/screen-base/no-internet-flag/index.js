import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { StyleSheet, View } from 'react-native'
import KText from '../../ktext'

const NoInternetFlag = ({ noConnection }) => {
	return (
		<>
			{noConnection ? (
				<View style={styles.container}>
					<KText
						style={styles.font}
						text={translate('app.noConnection')}
					/>
				</View>
			) : (
				undefined
			)}
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#FF5733',
		bottom: 0,
		left: 0,
		position: 'absolute',
		right: 0,
	},
	font: {
		color: 'white',
	},
})

const mapStateToProps = ({ app }) => ({
	noConnection: app.noConnection,
})

export default connect(mapStateToProps)(NoInternetFlag)
