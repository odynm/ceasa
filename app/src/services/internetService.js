import PublicIP from 'react-native-public-ip'
import NetInfo from '@react-native-community/netinfo'

export const getIp = async () => {
	return await PublicIP()
}

const verifyInternet = async () => {
	const data = await NetInfo.fetch()
	// TODO show modal no internet and
	// make a logic somewhere to start offline mode

	return data.isInternetReachable
}

const InternetService = {
	getIp,
	verifyInternet,
}

export default InternetService
