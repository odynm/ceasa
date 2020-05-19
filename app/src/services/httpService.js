// import qs from 'qs'
// import i18n from 'i18n-js'
// import axios from 'axios'
// import store from 'src/ducks'
// import config from 'src/config'
// import NetInfo from '@react-native-community/netinfo'
// import ToastService from './toastService'
// import { Keyboard } from 'react-native'
// import { Creators as UserCreators } from '../ducks/user'
// import { Creators as ModalCreators } from '../ducks/modal'
// import * as retryAxios from 'retry-axios'

// NetInfo.addEventListener(state => {
// 	if (state.type === 'none') {
// 		store.dispatch(ModalCreators.setModal(true))
// 	} else {
// 		store.dispatch(ModalCreators.setModal(false))
// 	}
// })

const requestInterceptor = config => {
	// const { accessToken } = store.getState().user
	// if (accessToken) {
	// 	config.headers.Authorization = `Bearer ${accessToken}`
	// }
	// config.headers['accept-language'] = i18n.locale
	// return config
}

const responseErrorInterceptor = async error => {
	// const data = await NetInfo.fetch()
	// if (!data.isInternetReachable) {
	// 	Keyboard.dismiss()
	// 	const { translate } = require('../i18n')
	// 	ToastService.show({ message: translate('app.noInternet') })
	// }
	// const { status } = error.response
	// if (status == 401) {
	// 	try {
	// 		const { refreshToken } = store.getState().user
	// 		const { data } = await HttpService.post('identity/refresh-token', {
	// 			refreshToken
	// 		})
	// 		const action = UserCreators.updateTokens(data)
	// 		const { accessToken } = await store.dispatch(action)
	// 		error.config.headers.Authorization = `Bearer ${accessToken}`
	// 		return axios.request(error.config)
	// 	} catch {
	// 		await store.dispatch(UserCreators.logout())
	// 	}
	// }
	// if (__DEV__) console.warn(error.config)
	// return Promise.reject(error)
}

const initialize = () => {
	// const instance = axios.create({ baseURL: config.API_URL })
	// instance.defaults.raxConfig = { instance }
	// retryAxios.attach(instance)
	// instance.interceptors.request.use(requestInterceptor)
	// instance.interceptors.response.use(
	// 	response => response,
	// 	responseErrorInterceptor
	// )
	// HttpService.instance = instance
}

// const paramsSerializer = params =>
// 	qs.stringify(params, { arrayFormat: 'repeat' })

// const get = (url, configs) =>
// 	HttpService.instance
// 		.get(url, { paramsSerializer, ...configs })
// 		.then(({ data }) => data)
// const put = (url, data, configs) =>
// 	HttpService.instance.put(url, data, configs).then(({ data }) => data)
// const post = (url, data, configs) =>
// 	HttpService.instance.post(url, data, configs).then(({ data }) => data)
// const deleteRequest = (url, configs) =>
// 	HttpService.instance
// 		.delete(url, { paramsSerializer, ...configs })
// 		.then(({ data }) => data)

// const isCancel = axios.isCancel
// const CancelToken = axios.CancelToken

const HttpService = {
	// get,
	// put,
	// post,
	// isCancel,
	initialize,
	// CancelToken,
	// instance: null,
	// delete: deleteRequest
}

export default HttpService
