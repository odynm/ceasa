import React from 'react'
import { View } from 'react-native'
import { translate } from 'src/i18n/translate'
import TextInput from 'src/components/fw/text-input'

const ClientSegment = ({ client, setClient }) => {
	return (
		<View>
			<TextInput
				value={client.key}
				label={translate('sell.clientKey')}
				setValue={value => setClient({ ...client, key: value })}
			/>
			<TextInput
				value={client.place}
				label={translate('sell.clientPlace')}
				setValue={value => setClient({ ...client, place: value })}
			/>
			<TextInput
				value={client.vehicle}
				label={translate('sell.clientVehicle')}
				setValue={value => setClient({ ...client, vehicle: value })}
			/>
		</View>
	)
}

export default ClientSegment
