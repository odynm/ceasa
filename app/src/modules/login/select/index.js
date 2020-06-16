import React from 'react'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import styles from './styles'
import svgLogo from 'res/svgs/svgLogo.svg'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'

const Login = ({ navigation }) => {
	const clickVendor = () => {
		navigation.navigate(screens.login)
	}

	return (
		<ScreenBase>
			<SvgXml style={styles.logo} xml={svgLogo} />
			<Button
				onPress={clickVendor}
				label={translate('loginSelect.vendor')}
			/>
			<Space size2 />
			<Button label={translate('loginSelect.loader')} />
		</ScreenBase>
	)
}

export default withNavigation(Login)
