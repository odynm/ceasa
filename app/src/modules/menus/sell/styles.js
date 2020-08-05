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
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: hp(50),
	},
	totalRowInside: {
		flexDirection: 'row',
		marginLeft: 0,
		marginRight: 'auto',
	},
	items: {
		marginTop: hp(10),
	},
	clientView: {
		marginTop: hp(10),
		height: hp(350),
	},
	centerText: {
		textAlign: 'center',
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
