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
	button: {
		marginBottom: hp(30),
		marginTop: 'auto',
	},
})

export default styles
