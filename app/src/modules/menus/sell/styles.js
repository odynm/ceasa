import { hp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	rowAlignText: {
		alignSelf: 'center',
	},
	addButton: {
		alignItems: 'center',
		borderRadius: hp(25),
		borderWidth: 1,
		height: hp(50),
		justifyContent: 'center',
		marginLeft: 'auto',
		marginRight: 0,
		width: hp(50),
	},
	checkbox: {
		marginLeft: 'auto',
		marginRight: 0,
	},
	footer: {
		marginBottom: hp(50),
		marginTop: 'auto',
	},
})

export default styles
