import React from 'react'
import { hp } from 'src/utils/screen'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import colors from 'src/constants/colors'

const Loader = ({ style, fullScreen }) => {
	const componentTypeStyle = fullScreen
		? styles.loaderFullScreen
		: styles.loader
	const mergedStyles = { ...componentTypeStyle, ...style }

	return (
		<>
			{fullScreen ? (
				<View style={styles.loaderView}>
					<ActivityIndicator
						size="large"
						color={colors.primary}
						style={mergedStyles}
					/>
				</View>
			) : (
				<ActivityIndicator
					size="large"
					color={colors.primary}
					style={mergedStyles}
				/>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	loader: {
		marginTop: hp(30),
	},
	loaderView: {
		backgroundColor: '#bbbbbb33',
		bottom: 0,
		flex: 1,
		position: 'absolute',
		top: 0,
		width: '100%',
	},
	loaderFullScreen: {
		marginTop: hp(250),
	},
})

export default Loader
