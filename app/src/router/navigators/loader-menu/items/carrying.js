import {wp} from 'src/utils/screen'
import {createStackNavigator} from 'react-navigation-stack'
import colors from 'src/constants/colors'
import CarryingLoader from 'src/modules/loader-modules/menus/carrying'

const CarryingStack = createStackNavigator(
    {
        CarryingLoader,
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

export default CarryingStack
