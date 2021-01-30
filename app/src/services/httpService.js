// import qs from 'qs'
// import i18n from 'i18n-js'
import { Keyboard } from 'react-native'
import { Creators as UserCreators } from 'src/ducks/user'
import axios from 'axios'
import store from 'src/ducks'
import config from 'src/config'
import InternetService from 'src/services/internetService'
// import { Creators as ModalCreators } from '../ducks/modal'
import * as retryAxios from 'retry-axios'
import screens from 'src/constants/screens'
import { Creators as AppCreators } from 'src/ducks/app'

// NetInfo.addEventListener(state => {
// 	if (state.type === 'none') {
// 		store.dispatch(ModalCreators.setModal(true))
// 	} else {
// 		store.dispatch(ModalCreators.setModal(false))
// 	}
// })

let navigation = {}
let navigationActions = {}

const requestInterceptor = requestConfig => {
	const { user } = store.getState().user
	const { loader } = store.getState().loader
	const { timezone } = store.getState().app
	if (user.accessToken && user.id) {
		requestConfig.headers.Auth = user.accessToken
		requestConfig.headers.Timezone = timezone
		if (user.parentUser && user.parentUser > 0) {
			requestConfig.headers.User = user.parentUser
			requestConfig.headers.ChildUser = user.id
		} else {
			requestConfig.headers.User = user.id
		}
	} else if (loader.accessToken && loader.id) {
		const { userId } = store.getState().loader
		requestConfig.headers.Auth = loader.accessToken
		requestConfig.headers.Loader = loader.id
		requestConfig.headers.User = userId
		requestConfig.headers.Timezone = timezone
	}
	//config.headers['accept-language'] = i18n.locale
	return requestConfig
}

const responseErrorInterceptor = async error => {
	const isInternetReachable = await InternetService.isInternetReachable()
	if (!isInternetReachable) {
		Keyboard.dismiss()
		console.warn('net not reachable')
		store.dispatch(AppCreators.setNoConnection(true))
		return Promise.resolve(error)
		//ToastService.show({ message: translate('app.noInternet') })
	}

	const status = error && error.response ? error.response.status : null
	if (status == 401) {
		try {
			await store.dispatch(UserCreators.logout())
			if (navigation.current) {
				navigation.current.dispatch(
					navigationActions.navigate({ routeName: screens.login }),
				)
			}
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
		store.dispatch(AppCreators.setNoConnection(true))
		console.warn('server down')
	}

	return Promise.reject(error)
}

const initialize = (navigationRef, navActions) => {
	navigationActions = navActions
	navigation = navigationRef
	const instance = axios.create({ baseURL: config.API_URL })
	instance.defaults.raxConfig = { instance }
	retryAxios.attach(instance)
	instance.interceptors.request.use(requestInterceptor)
	instance.interceptors.response.use(response => {
		store.dispatch(AppCreators.setNoConnection(false))
		return response
	}, responseErrorInterceptor)
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

const post = (url, data, reject) =>
	HttpService.instance.post(url, data, undefined).then(
		({ data: response }) => response,
		err => {
			if (reject) {
				reject(err)
			}
			return { success: false }
		},
	)

const deleteRequest = (url, configs) =>
	HttpService.instance.delete(url, configs).then(({ data }) => data)

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
	delete: deleteRequest,
}

export default HttpService
