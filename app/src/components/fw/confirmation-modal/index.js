import React from 'react'
import { translate } from 'src/i18n/translate'
import { wp, hp, getWidth } from 'src/utils/screen'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Button from '../button'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const ConfirmationModal = ({ content, onClose, onAccept, open, header }) => {
	return (
		open && (
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.base}>
					<View
						onStartShouldSetResponder={() => true}
						style={styles.container}>
						{header && header.length > 0 && (
							<View style={styles.header}>
								<KText bold text={header} />
							</View>
						)}
						<View style={styles.content}>
							<KText text={content} />
						</View>
						<View style={styles.row}>
							<Button
								tiny
								onPress={onClose}
								label={translate('app.no')}
								style={styles.redButtonView}
								textStyle={styles.redButtonText}
							/>
							<Button
								tiny
								onPress={() => {
									onClose()
									onAccept()
								}}
								label={translate('app.yes')}
							/>
						</View>
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
		height: hp(200),
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
	row: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginBottom: hp(10),
	},
	redButtonView: {
		borderColor: colors.red,
	},
	redButtonText: {
		color: colors.red,
	},
})

export default ConfirmationModal
