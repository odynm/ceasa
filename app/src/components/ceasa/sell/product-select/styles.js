import { StyleSheet } from 'react-native'
import { fv, hp, wp } from 'src/utils/screen'

const styles = StyleSheet.create({
	centerText: {
		textAlign: 'center',
	},
	searchIcon: {
		fontSize: fv(16),
		marginHorizontal: hp(5),
		marginTop: hp(10),
	},
	searchText: {
		paddingVertical: hp(5),
		width: wp(280),
	},
	searchView: {
		borderRadius: hp(5),
		borderWidth: 1,
		flexDirection: 'row',
		marginTop: hp(15),
	},
})

export default styles
