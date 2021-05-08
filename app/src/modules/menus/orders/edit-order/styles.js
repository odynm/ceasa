import {hp, wp} from 'src/utils/screen'
import {StyleSheet} from 'react-native'
import colors from 'src/constants/colors'

const styles = StyleSheet.create({
    redButtonView: {
        borderColor: colors.red,
    },
    redButtonText: {
        color: colors.red,
    },
    client: {
        marginTop: hp(10),
    },
    strip: {
        alignSelf: 'center',
        backgroundColor: '#F9F0A5',
        width: wp(375),
    },
    blocked: {
        textAlign: 'center',
    },
    editProductView: {
        paddingVertical: hp(5),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowAlignText: {
        alignSelf: 'center',
    },
    checkbox: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    footer: {
        marginBottom: hp(50),
        marginTop: 'auto',
    },
})

export default styles
