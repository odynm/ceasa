import React from 'react'
import { View } from 'react-native'
import { translate } from 'src/i18n/translate'
import TextInput from 'src/components/fw/text-input'

const ClientSegment = ({ client, errors, editable, setClient }) => {
	return (
		<View>
			<TextInput
				value={client.key}
				editable={editable}
				errorMessage={errors && errors.key}
				label={translate('sell.clientKey')}
				setValue={value => setClient({ ...client, key: value })}
			/>
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
