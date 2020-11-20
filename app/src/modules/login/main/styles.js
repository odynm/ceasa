import { hp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	logo: {
		alignSelf: 'center',
		marginBottom: hp(40),
		marginTop: hp(40),
	},
	loader: {
		bottom: hp(25),
	},
	checkbox: {
		marginLeft: 'auto',
		marginRight: 0,
		bottom: hp(10),
	},
	row: {
		flexDirection: 'row',
	},
})

export default styles
