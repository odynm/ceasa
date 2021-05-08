import {wp} from 'src/utils/screen'
import {createStackNavigator} from 'react-navigation-stack'
import colors from 'src/constants/colors'
import OptionsLoader from 'src/modules/loader-modules/menus/options'

const OptionsLoaderStack = createStackNavigator(
    {
        OptionsLoader,
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

export default OptionsLoaderStack
