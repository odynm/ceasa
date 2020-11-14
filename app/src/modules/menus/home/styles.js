import { hp, wp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: hp(20),
		marginHorizontal: wp(10),
	},
	flex: {
		flex: 1,
	},
	buttons: {
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	scrollView: {
		flex: 1,
		marginBottom: hp(30),
		marginTop: hp(10),
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	details: {
		marginTop: hp(20),
	},
})

export default styles
