import React from 'react'
import { wp } from 'src/utils/screen'
import { SvgXml } from 'react-native-svg'
import { withNavigation } from 'react-navigation'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import colors from 'src/constants/colors'
import svgBack from 'res/svgs/svgBack.svg'

const hitSlop = {
	bottom: 10,
	left: 20,
	right: 20,
	top: 10,
}

const ScreenHeader = ({ noBack, navigation }) => (
	<View style={styles.container}>
		{noBack ? (
			<View style={styles.backButton} />
		) : (
			<TouchableOpacity
				hitSlop={hitSlop}
				activeOpacity={0.3}
				style={styles.backButton}
				onPress={() => navigation.goBack(null)}>
				<SvgXml
					xml={svgBack}
					stroke={colors.primary}
					strokeWidth="5"
					strokeLinejoin={'round'}
					strokeLinecap={'round'}
				/>
			</TouchableOpacity>
		)}
	</View>
)

const styles = StyleSheet.create({
	backButton: {
		marginLeft: wp(20),
	},
	container: {
		alignItems: 'center',
		flexDirection: 'row',
	},
})

ScreenHeader.propTypes = {
	children: PropTypes.string,
}

export default withNavigation(ScreenHeader)
