import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { wp, hp, widthPercentageToDP, getWorkableArea } from 'src/utils/screen'
import NoInternetFlag from './no-internet-flag'
import CloseKeyboardView from './close-keyboard-view'
import UnexpectedError from 'src/components/ceasa/unexpected-error'

const ScreenBaseComponent = ({
	style,
	children,
	useScroll,
	heightStyle,
	useKeyboardClose,
	...props
}) => (
	<>
		<UnexpectedError />
		{useKeyboardClose ? (
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
					<>
						<ScrollView style={styles.scrollView}>
							<View style={[styles.containerView, style]} {...props}>
								{children}
							</View>
						</ScrollView>
						<NoInternetFlag />
					</>
				) : (
					<>
						<View style={[styles.containerView, style]} {...props}>
							{children}
						</View>
						<NoInternetFlag />
					</>
				)}
			</View>
		)}
	</>
)

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: 'white',
		flex: 1,
	},
	containerView: {
		minHeight: getWorkableArea(),
		paddingHorizontal: wp(25),
		paddingTop: hp(13),
		width: widthPercentageToDP(100),
	},
})

export default ScreenBaseComponent
