// import qs from 'qs'
// import i18n from 'i18n-js'
import axios from 'axios'
import store from 'src/ducks'
import config from 'src/config'
import NetInfo from '@react-native-community/netinfo'
import ToastService from './toastService'
import { Keyboard } from 'react-native'
import { Creators as UserCreators } from 'src/ducks/user'
// import { Creators as ModalCreators } from '../ducks/modal'
import * as retryAxios from 'retry-axios'

// NetInfo.addEventListener(state => {
// 	if (state.type === 'none') {
// 		store.dispatch(ModalCreators.setModal(true))
// 	} else {
// 		store.dispatch(ModalCreators.setModal(false))
// 	}
// })

const requestInterceptor = requestConfig => {
	const { accessToken, id } = store.getState().user
	if (accessToken && id) {
		requestConfig.headers.Auth = accessToken
		requestConfig.headers.User = id
	}
	//config.headers['accept-language'] = i18n.locale
	return requestConfig
}

const responseErrorInterceptor = async error => {
	const netInfo = await NetInfo.fetch()
	if (!netInfo.isInternetReachable) {
		Keyboard.dismiss()
		console.warn('net not reachable')
		//ToastService.show({ message: translate('app.noInternet') })
	}
	console.warn('err', error)

	const status = error && error.response ? error.response.status : null
	if (status == 401) {
		try {
			const { refreshToken } = store.getState().user
			const { data } = await HttpService.post('user/refresh-token', {
				refreshToken,
			})
			const action = UserCreators.updateTokens(data)
			const { accessToken } = await store.dispatch(action)
			error.config.headers.Authorization = accessToken
			return axios.request(error.config)
		} catch {
			await store.dispatch(UserCreators.logout())
		}
	} else if (status != null) {
		console.warn('Return status', status)
	} else {
		console.warn('server down')
	}

	return Promise.reject(error)
}

const initialize = () => {
	const instance = axios.create({ baseURL: config.API_URL })
	instance.defaults.raxConfig = { instance }
	retryAxios.attach(instance)
	instance.interceptors.request.use(requestInterceptor)
	instance.interceptors.response.use(
		response => response,
		responseErrorInterceptor,
	)
	HttpService.instance = instance
}

// const paramsSerializer = params =>
// 	qs.stringify(params, { arrayFormat: 'repeat' })

// const get = (url, configs) =>
// 	HttpService.instance
// 		.get(url, { paramsSerializer, ...configs })
// 		.then(({ data }) => data)
// const put = (url, data, configs) =>
// 	HttpService.instance.put(url, data, configs).then(({ data }) => data)

// const post = async (url, data, configs) => {
// 	return await HttpService.instance.post(url, data, configs)
// }

const post = (url, data, configs) =>
	HttpService.instance.post(url, data, configs).then(({ data }) => data)

// const deleteRequest = (url, configs) =>
// 	HttpService.instance
// 		.delete(url, { paramsSerializer, ...configs })
// 		.then(({ data }) => data)

// const isCancel = axios.isCancel
// const CancelToken = axios.CancelToken

const HttpService = {
	// get,
	// put,
	post,
	// isCancel,
	initialize,
	// CancelToken,
	// instance: null,
	// delete: deleteRequest
}

export default HttpService
