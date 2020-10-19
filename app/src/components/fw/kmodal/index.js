import React from 'react'
import { wp, hp, getWidth, getWorkableArea } from 'src/utils/screen'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const KModal = ({ children, onClose, open, size, header }) => {
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

	return (
		open && (
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.base}>
					<View
						onStartShouldSetResponder={() => true}
						style={containerStyle}>
						{header && header.length > 0 && (
							<View style={styles.header}>
								<KText bold text={header} />
							</View>
						)}
						<View style={styles.content}>{children}</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
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
})

export default KModal
