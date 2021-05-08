import {wp} from 'src/utils/screen'
import {createStackNavigator} from 'react-navigation-stack'
import Sell from 'src/modules/menus/sell'
import colors from 'src/constants/colors'

const SellStack = createStackNavigator(
    {
        Sell,
    },
    {
        defaultNavigationOptions: () => ({
            headerTitleStyle: {
                color: colors.primary,
                fontFamily: 'NotoSansBengaliUI-Bold',
            },
            headerTitleContainerStyle: {
                left: wp(60),
            },
        }),
    },
)

export default SellStack
