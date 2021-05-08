import {StyleSheet} from 'react-native'
import {wp, hp, fv} from 'src/utils/screen'
import colors from 'src/constants/colors'

const styles = StyleSheet.create({
    openContainer: {
        backgroundColor: 'white',
        borderRadius: hp(10),
        height: hp(500),
        paddingVertical: hp(10),
        paddingLeft: wp(10),
        paddingRight: wp(2),

        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    containerSmall: {
        height: hp(350),
    },
    labelNotRegistered: {
        marginBottom: hp(5),
        textAlign: 'center',
    },
    scrollView: {
        paddingRight: wp(8),
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
    line: {
        borderBottomWidth: 1,
    },
    listView: {
        marginBottom: hp(10),
        marginTop: hp(10),
    },
    listItemCard: {
        borderColor: colors.primary,
        borderRadius: hp(10),
        borderWidth: 1,
        marginVertical: hp(5),
        padding: hp(10),
    },
    listItemText: {
        fontSize: fv(18),
    },
    error: {
        color: colors.red,
        fontSize: fv(12),
    },
})

export default styles
