import app from './app'
import user from './user'
import order from './order'
import terms from './terms'
import storage from './storage'
import products from './products'

import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const reducers = combineReducers({
	app,
	user,
	order,
	terms,
	storage,
	products,
})

const middlewares = [thunk]

if (__DEV__) {
	middlewares.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middlewares))

export default store
