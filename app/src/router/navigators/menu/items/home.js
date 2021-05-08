import {wp} from 'src/utils/screen'
import {createStackNavigator} from 'react-navigation-stack'
import Home from 'src/modules/menus/home'
import colors from 'src/constants/colors'
import AdditionalCost from 'src/modules/menus/home/additional-cost'

const HomeStack = createStackNavigator(
    {
        Home,
        AdditionalCost,
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

export default HomeStack
