import { hp } from 'src/utils/screen'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginBottom: hp(50),
        marginTop: hp(50),
    },
    loader: {
        bottom: hp(25),
    },
    checkbox: {
        marginLeft: 'auto',
        marginRight: 0,
        bottom: hp(10),
    },
    row: {
        flexDirection: 'row',
    },
    version: {
        bottom: hp(5),
        position: 'absolute',
        right: hp(5),
    },
})

export default styles
