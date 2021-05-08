import {StyleSheet} from 'react-native'
import {
    hp,
    wp,
    heightPercentageToDP,
    widthPercentageToDP,
} from 'src/utils/screen'

const styles = StyleSheet.create({
    camera: {
        height: heightPercentageToDP(100),
        position: 'absolute',
        width: widthPercentageToDP(100),
    },
    overlay: {
        backgroundColor: 'rgba(50,50,50,0.8)',
        position: 'absolute',
    },
    bottom: {
        height: hp(250),
        top: wp(250) + hp(182),
        width: widthPercentageToDP(100),
    },
    right: {
        height: wp(250),
        right: 0,
        top: hp(182),
        width: wp(62.5),
    },
    top: {
        height: hp(182),
        width: widthPercentageToDP(100),
    },
    container: {
        height: heightPercentageToDP(100),
        width: widthPercentageToDP(100),
    },
    left: {
        height: wp(250),
        top: hp(182),
        width: wp(62.5),
    },
    middleArea: {
        left: wp(62.5),
        position: 'absolute',
        top: hp(182),
    },
})

export default styles
