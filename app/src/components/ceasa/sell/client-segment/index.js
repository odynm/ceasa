import React, { useState } from 'react'
import {
	ScrollView,
	View,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native'
import { translate } from 'src/i18n/translate'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import TextInput from 'src/components/fw/text-input'

const ClientSegment = ({ client, clients, errors, editable, setClient }) => {
	const [keyUpper, setKeyUpper] = useState(false)
	const [writingKey, setWritingKey] = useState(false)

	return (
		<View>
			<TextInput
				value={client.key}
				editable={editable}
				onFocus={() => setWritingKey(true)}
				onBlur={() => setWritingKey(false)}
				errorMessage={errors && errors.key}
				label={translate('sell.clientKey')}
				setValue={value => {
					setKeyUpper(value.toUpperCase())
					setClient({ ...client, key: value })
				}}
			/>
			{writingKey && client.key.length > 0 && clients?.length > 0 && (
				<View style={styles.autocompleteSelector}>
					<ScrollView keyboardShouldPersistTaps="handled">
						{clients
							.filter(x => x.key.toUpperCase().startsWith(keyUpper))
							.map((item, i) => (
								<TouchableWithoutFeedback
									key={i}
									onPress={() => {
										setClient(item)
										setWritingKey('')
										setKeyUpper('')
										Keyboard.dismiss()
									}}>
									<View>
										<KText
											style={styles.autocompleteText}
											text={item.key}
										/>
									</View>
								</TouchableWithoutFeedback>
							))}
					</ScrollView>
				</View>
			)}
			<TextInput
				editable={editable}
				value={client.place}
				label={translate('sell.clientPlace')}
				setValue={value => setClient({ ...client, place: value })}
			/>
			<TextInput
				editable={editable}
				value={client.vehicle}
				label={translate('sell.clientVehicle')}
				setValue={value => setClient({ ...client, vehicle: value })}
			/>
		</View>
	)
}

export default ClientSegment
