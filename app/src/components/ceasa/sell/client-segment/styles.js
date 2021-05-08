import {hp, wp} from 'src/utils/screen'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    autocompleteSelector: {
        position: 'absolute',
        backgroundColor: 'white',
        top: hp(70),
        zIndex: 10,
        height: hp(200),
        width: wp(300),
        borderRadius: wp(2),
    },
    autocompleteText: {
        marginHorizontal: hp(10),
        marginVertical: wp(10),
    },
})

export default styles
