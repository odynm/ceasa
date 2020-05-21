import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { wp, hp, widthPercentageToDP, getWorkableArea } from 'src/utils/screen'
import CloseKeyboardView from './close-keyboard-view'

const ScreenBaseComponent = ({
	style,
	children,
	useScroll,
	heightStyle,
	useKeyboardClose,
	...props
}) =>
	useKeyboardClose ? (
		<CloseKeyboardView style={heightStyle}>
			{useScroll ? (
				<ScrollView style={styles.scrollView}>
					<View style={[styles.containerView, style]} {...props}>
						{children}
					</View>
				</ScrollView>
			) : (
				<View style={[styles.containerView, style]} {...props}>
					{children}
				</View>
			)}
		</CloseKeyboardView>
	) : (
		<View style={heightStyle}>
			{useScroll ? (
				<ScrollView style={styles.scrollView}>
					<View style={[styles.containerView, style]} {...props}>
						{children}
					</View>
				</ScrollView>
			) : (
				<View style={[styles.containerView, style]} {...props}>
					{children}
				</View>
			)}
		</View>
	)

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: 'white',
	},
	containerView: {
		minHeight: getWorkableArea(),
		paddingHorizontal: wp(25),
		paddingTop: hp(13),
		width: widthPercentageToDP(100),
	},
})

export default ScreenBaseComponent
