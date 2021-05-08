import {Header} from 'react-navigation-stack'
import {Dimensions, PixelRatio, StatusBar} from 'react-native'
import {widthPercentageToDP as _wp} from 'react-native-responsive-screen'

const _hp = (heightPercent) => {
    const elemHeight =
        typeof heightPercent === 'number'
            ? heightPercent
            : parseFloat(heightPercent)

    return PixelRatio.roundToNearestPixel(
        (getWorkableArea() * elemHeight) / 100,
    )
}

export const heightRatio = 667
export const widthRatio = 375

export const widthPercentageToDP = (percent) => _wp(percent)
export const heightPercentageToDP = (percent) => _hp(percent)

export const wp = (width) => _wp((width * 100) / widthRatio)
export const hp = (height) => _hp((height * 100) / heightRatio)

export const fv = (value) =>
    (value * Dimensions.get('window').width) / widthRatio

export const getWorkableArea = () =>
    Dimensions.get('window').height - Header.HEIGHT - StatusBar.currentHeight

export const getWidth = () => Dimensions.get('window').width
