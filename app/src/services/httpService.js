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
	const { user } = store.getState().user
	const { loader } = store.getState().loader
	if (user.accessToken && user.id) {
		requestConfig.headers.Auth = user.accessToken
		requestConfig.headers.User = user.id
	} else if (loader.accessToken && loader.id) {
		requestConfig.headers.Auth = loader.accessToken
		requestConfig.headers.Loader = loader.id
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

	const status = error && error.response ? error.response.status : null
	if (status == 401) {
		try {
			await store.dispatch(UserCreators.logout())
			// TODO refresh token
			// const action = UserCreators.updateToken(data)
			// const { accessToken } = await store.dispatch(action)
			// error.config.headers.Authorization = accessToken
			// return axios.request(error.config)
		} catch (ex) {
			console.warn('erro', ex)
			await store.dispatch(UserCreators.logout())
		}
	} else if (status != null) {
		console.warn('Return status', status, JSON.stringify(error))
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

// I removed paramsSerializer from this, I don't know if something changed
const get = (url, configs) =>
	HttpService.instance.get(url, configs).then(({ data }) => data)

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
	get,
	// put,
	post,
	// isCancel,
	initialize,
	// CancelToken,
	// instance: null,
	// delete: deleteRequest
}

export default HttpService
