import React from 'react'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import Error from 'src/components/fw/error'
import Loading from 'src/components/fw/loading'
import svgDropArrow from 'res/svgs/svgDropArrow.svg'

const Picker = ({
	label,
	onPress,
	loading,
	disabled,
	selected,
	errorMessage,
}) => {
	const handlePress = () => {
		if (!disabled) {
			onPress()
		}
	}

	return (
		<View>
			{loading ? (
				<Loading style={styles.loading} />
			) : (
				<>
					<KText bold text={label} />
					<TouchableOpacity onPress={handlePress}>
						<View
							style={
								disabled
									? styles.pickerContainerDisabled
									: styles.pickerContainer
							}>
							<KText
								style={
									disabled
										? styles.pickerTextDisabled
										: selected && selected.length > 0
										? styles.pickerTextSelected
										: styles.pickerText
								}
								text={
									selected && selected.length > 0
										? selected
										: translate('storage.select')
								}
							/>
							<View style={styles.pickerIcon}>
								<SvgXml xml={svgDropArrow} />
							</View>
						</View>
					</TouchableOpacity>
					<Error text={errorMessage} />
				</>
			)}
		</View>
	)
}

export default Picker
