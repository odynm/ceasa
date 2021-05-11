import {hp, wp} from 'src/utils/screen'
import {StyleSheet} from 'react-native'
import colors from 'src/constants/colors'

const styles = StyleSheet.create({
    headerCards: {
        borderBottomWidth: 1,
        borderColor: colors.primary,
        height: hp(55),
        paddingVertical: hp(10),
        position: 'absolute',
        width: wp(375),
    },
    scrollView: {
        width: wp(375),
    },
    footer: {
        marginBottom: hp(50),
        marginTop: 'auto',
    },
})

export default styles
