import {hp, wp} from 'src/utils/screen'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginBottom: hp(90),
        marginTop: hp(90),
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
    version: {
        bottom: hp(5),
        position: 'absolute',
        right: hp(5),
    },
})

export default styles
