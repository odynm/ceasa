import React from 'react'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { TouchableWithoutFeedback, View } from 'react-native'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import svgDropArrow from 'res/svgs/svgDropArrow.svg'

const Picker = ({ label, onPress, selected }) => {
	return (
		<View>
			<KText bold text={label} />
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.pickerContainer}>
					<KText
						style={
							selected && selected.length > 0
								? styles.pickerTextSelected
								: styles.pickerText
						}
						text={
							selected && selected.length > 0
								? selected
								: translate('register.select')
						}
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
