import { hp, wp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	logo: {
		alignSelf: 'center',
		marginBottom: hp(70),
		marginTop: hp(80),
	},
	wppView: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: hp(50),
	},
	wppLogo: {
		height: hp(40),
		width: wp(40),
	},
})

export default styles
