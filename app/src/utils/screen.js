import {
	widthPercentageToDP as _wp,
	heightPercentageToDP as _hp,
} from 'react-native-responsive-screen'
import { Dimensions } from 'react-native'
import { Header } from 'react-navigation-stack'

export const heightRatio = 667
export const widthRatio = 375

export const widthPercentageToDP = percent => _wp(percent)
export const heightPercentageToDP = percent => _hp(percent)

export const wp = width => _wp((width * 100) / widthRatio)
export const hp = height => _hp((height * 100) / heightRatio)

export const fv = value => (value * Dimensions.get('window').width) / widthRatio

export const getWorkableArea = () =>
	Dimensions.get('window').height - Header.HEIGHT
