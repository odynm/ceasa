import { hp, wp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'
import colors from 'src/constants/colors'

const styles = StyleSheet.create({
	scrollview: {
		flex: 1,
	},
	container: {
		borderColor: colors.primary,
		borderRadius: wp(10),
		borderWidth: 1,
		marginVertical: hp(5),
		paddingHorizontal: wp(10),
		paddingVertical: hp(8),
	},
	row: {
		flexDirection: 'row',
	},
	amount: {
		marginLeft: 'auto',
		marginRight: 0,
	},
})

export default styles
