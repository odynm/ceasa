import React from 'react'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { TouchableWithoutFeedback, View } from 'react-native'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import svgDropArrow from '../../../../../res/svgs/svgDropArrow.svg'

const Picker = ({ label, onPress }) => {
	return (
		<View>
			<KText bold text={label} />
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.pickerContainer}>
					<KText
						style={styles.pickerText}
						text={translate('register.select')}
					/>
					<View style={styles.pickerIcon}>
						<SvgXml xml={svgDropArrow} />
					</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	)
}

export default Picker
