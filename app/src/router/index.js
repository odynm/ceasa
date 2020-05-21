import React from 'react'
import { createAppContainer } from 'react-navigation'
import AppNavigator from './navigators/app'

export const navigationRef = React.createRef()

export default createAppContainer(AppNavigator)
