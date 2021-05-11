import React from 'react'
import {hp, wp} from 'src/utils/screen'
import {SvgXml} from 'react-native-svg'
import {translate} from 'src/i18n/translate'
import {withNavigation} from 'react-navigation'
import {Image, View, TouchableOpacity, Linking} from 'react-native'
import styles from './styles'
import config from 'src/config'
import pngWpp from 'res/pngs/wpp.png'
import KText from 'src/components/fw/ktext'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import svgLogo from 'res/svgs/v13/svgLogo.svg'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const Login = ({navigation}) => {
    const clickVendor = () => {
        navigation.navigate(screens.login)
    }

    const clickLoader = () => {
        navigation.navigate(screens.loginLoader)
    }

    return (
        <>
            <ScreenBase>
                <SvgXml style={styles.logo} xml={svgLogo} />
                <Button
                    onPress={clickVendor}
                    label={translate('loginSelect.vendor')}
                />
                <Space size2 />
                <Button
                    onPress={clickLoader}
                    label={translate('loginSelect.loader')}
                />
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(
                                'https://api.whatsapp.com/send?phone=5551996582662',
                            )
                        }}>
                        <View style={styles.wppView}>
                            <View>
                                <KText
                                    text={translate('loginSelect.support')}
                                />
                                <KText
                                    bold
                                    text={translate('loginSelect.wpp')}
                                />
                            </View>
                            <Image
                                width={wp(20)}
                                height={hp(20)}
                                source={pngWpp}
                                resizeMode={'center'}
                                style={styles.wppLogo}
                                resizeMethod={'resize'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScreenBase>
            <KText style={styles.version} text={`Versão: ${config.VERSION}`} />
        </>
    )
}

Login.navigationOptions = () => ({
    title: translate('login.login'),
    headerLeft: (props) => <ScreenHeader {...props} />,
})

export default withNavigation(Login)
