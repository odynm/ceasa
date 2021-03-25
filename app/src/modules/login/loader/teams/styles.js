import { hp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	rowSpaceAround: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	flex: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
		marginBottom: hp(20),
	},
	card: {
		marginBottom: hp(20),
	},
	joinArea: {
		marginBottom: hp(30),
		marginTop: 'auto',
		flex: 1,
	},
	joinText: {
		textAlign: 'center',
	},
	lastButton: {
		marginBottom: hp(30),
	},
})

export default styles
