import React from 'react'
import AppNavigator from './navigators/app'
import { createAppContainer } from 'react-navigation'

export const navigationRef = React.createRef()

export default createAppContainer(AppNavigator)
