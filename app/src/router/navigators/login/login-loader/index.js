import {wp} from 'src/utils/screen'
import {createStackNavigator} from 'react-navigation-stack'
import colors from 'src/constants/colors'
import LoginSelect from 'src/modules/login/select'
import LoginLoader from 'src/modules/login/loader/main'

const LoginLoaderStack = createStackNavigator(
    {
        LoginSelect,
        LoginLoader,
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

export default LoginLoaderStack
