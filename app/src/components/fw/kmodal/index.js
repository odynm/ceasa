import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { wp, hp, getWidth, getWorkableArea } from 'src/utils/screen'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const KModal = ({ children, onClose, open, size, header, style }) => {
	const containerStyle =
		size > 0
			? [
					styles.container,
					{
						height: hp(size),
						marginBottom: getWorkableArea() - hp(size) - hp(50),
					},
			  ]
			: styles.container

	const mergedContainerStyles = [containerStyle, style]

	return (
		open && (
			<View style={styles.base}>
				<View
					onStartShouldSetResponder={() => true}
					style={mergedContainerStyles}>
					{header && header.length > 0 && (
						<>
							<TouchableOpacity
								style={styles.clickable}
								onPress={onClose}>
								<View style={styles.closeX}>
									<KText bold fontSize={24} text="X" />
								</View>
							</TouchableOpacity>
							<View style={styles.header}>
								<KText bold text={header} />
							</View>
						</>
					)}
					<View style={styles.content}>{children}</View>
				</View>
			</View>
		)
	)
}

const styles = StyleSheet.create({
	base: {
		alignItems: 'center',
		backgroundColor: 'rgba(1,1,1,0.6)',
		height: '100%',
		justifyContent: 'center',
		position: 'absolute',
		zIndex: 100,
		width: getWidth(),
	},
	container: {
		backgroundColor: 'white',
		borderRadius: wp(10),
		height: hp(600),
		marginHorizontal: 'auto',
		marginVertical: 'auto',
		width: wp(320),
	},
	header: {
		borderBottomColor: colors.primary,
		borderBottomWidth: 1,
		marginVertical: hp(10),
		marginHorizontal: wp(10),
	},
	content: {
		flex: 1,
		marginBottom: hp(20),
		marginHorizontal: wp(10),
		marginTop: hp(10),
	},
	clickable: {
		flex: 1,
		height: hp(60),
		position: 'absolute',
		right: wp(-10),
		top: hp(-20),
		width: hp(60),
		zIndex: 150,
	},
	closeX: {
		alignItems: 'center',
		backgroundColor: colors.white,
		borderColor: colors.primary,
		borderRadius: wp(30),
		borderWidth: hp(3),
		flex: 1,
		height: hp(60),
		justifyContent: 'center',
		position: 'absolute',
		width: hp(60),
	},
})

export default KModal
