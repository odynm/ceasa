import app from './app'
import user from './user'
import home from './home'
import team from './team'
import order from './order'
import terms from './terms'
import loader from './loader'
import storage from './storage'
import products from './products'
import editOrder from './order/edit-order'
import ordersVendor from './orders-vendor'
import ordersLoader from './orders-loader'
import editStorage from './storage/edit-storage'

import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const reducers = combineReducers({
	app,
	user,
	home,
	team,
	order,
	terms,
	loader,
	storage,
	products,
	editOrder,
	editStorage,
	ordersVendor,
	ordersLoader,
})

const middlewares = [thunk]

if (__DEV__) {
	middlewares.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middlewares))

export default store
