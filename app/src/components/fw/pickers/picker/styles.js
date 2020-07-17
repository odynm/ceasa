import { StyleSheet } from 'react-native'
import { wp, hp } from 'src/utils/screen'
import colors from 'src/constants/colors'

const styles = StyleSheet.create({
	loading: {
		borderRadius: wp(5),
		height: hp(62),
		marginBottom: hp(15),
		width: '100%',
	},
	pickerContainerDisabled: {
		borderBottomColor: colors.lightGray,
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: hp(10),
	},
	pickerContainer: {
		borderBottomColor: colors.gray,
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: hp(10),
	},
	pickerTextDisabled: {
		color: colors.lightGray,
		paddingBottom: hp(5),
	},
	pickerText: {
		color: colors.gray,
		paddingBottom: hp(5),
	},
	pickerTextSelected: {
		color: colors.primary,
		paddingBottom: hp(5),
	},
	pickerIcon: {
		paddingRight: wp(10),
		paddingTop: hp(5),
	},
})

export default styles
