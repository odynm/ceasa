import app from './app'
import user from './user'
import home from './home'
import team from './team'
import order from './order'
import terms from './terms'
import client from './client'
import loader from './loader'
import offline from './offline'
import storage from './storage'
import products from './products'
import editOrder from './order/edit-order'
import ordersVendor from './orders-vendor'
import ordersLoader from './orders-loader'
import notifications from './notifications'
import editStorage from './storage/edit-storage'
import additionalCost from './additional-cost'

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
	client,
	loader,
	offline,
	storage,
	products,
	editOrder,
	editStorage,
	ordersVendor,
	ordersLoader,
	notifications,
	additionalCost,
})

const middlewares = [thunk]

if (__DEV__) {
	middlewares.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middlewares))

export default store
