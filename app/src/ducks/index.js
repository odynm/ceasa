import app from './app'
import user from './user'
import team from './team'
import order from './order'
import terms from './terms'
import storage from './storage'
import products from './products'
import editOrder from './order/edit-order'
import ordersVendor from './orders-vendor'

import rfdc from 'rfdc'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const reducers = combineReducers({
	app,
	user,
	team,
	order,
	terms,
	storage,
	products,
	editOrder,
	ordersVendor,
})

const middlewares = [thunk]

if (__DEV__) {
	middlewares.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middlewares))

export default store
