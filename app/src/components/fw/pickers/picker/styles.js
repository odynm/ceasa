import { StyleSheet } from 'react-native'
import { wp, hp } from 'src/utils/screen'
import colors from 'src/constants/colors'

const styles = StyleSheet.create({
	pickerContainer: {
		borderBottomColor: colors.gray,
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: hp(10),
	},
	pickerText: {
		color: colors.gray,
		paddingBottom: hp(5),
	},
	pickerIcon: {
		paddingRight: wp(10),
		paddingTop: hp(5),
	},
})

export default styles
