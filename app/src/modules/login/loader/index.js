import React from 'react'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import styles from './styles'
import Space from 'src/components/fw/space'
import ScreenBase from 'src/components/fw/screen-base'

const LoginLoader = ({ navigation }) => {
	return (
		<ScreenBase>
			<Space size2 />
		</ScreenBase>
	)
}

export default withNavigation(LoginLoader)
