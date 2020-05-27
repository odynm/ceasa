import React, { useState, useEffect } from 'react'
import {
	View,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
} from 'react-native'
import { SvgXml } from 'react-native-svg'
import styles from './styles'
import Picker from '../picker'
import Modal from 'react-native-modal'
import KText from 'src/components/fw/ktext'
import KeyboardService from 'src/services/keyboardService'
import svgSearch from '../../../../../res/svgs/svgSearch.svg'
import { translate } from 'src/i18n/translate'

const RecentRegisterPicker = ({
	list,
	label,
	listLabel,
	listRecent,
	labelNotRegistered,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

	useEffect(() => {
		KeyboardService.subscribeHide(onKeyboardHide)
	}, [])

	const onKeyboardHide = () => {
		setIsKeyboardOpen(false)
	}

	const onOpenKeyboard = () => {
		setIsKeyboardOpen(true)
	}

	const onCloseKeyboard = () => {
		setIsKeyboardOpen(false)
	}

	return (
		<>
			<Picker label={label} onPress={() => setIsOpen(true)} />
			<Modal
				isVisible={isOpen}
				onRequestClose={() => setIsOpen(false)}
				onBackdropPress={() => setIsOpen(false)}
				backdropOpacity={0.4}>
				<KeyboardAvoidingView
					style={
						isKeyboardOpen
							? { ...styles.openContainer, ...styles.containerSmall }
							: styles.openContainer
					}>
					<TouchableWithoutFeedback>
						{/* TODO: make this button work*/}
						<KText
							bold
							link
							text={labelNotRegistered}
							style={styles.labelNotRegistered}
						/>
					</TouchableWithoutFeedback>
					<ScrollView style={styles.scrollView} persistentScrollbar={true}>
						{listRecent && listRecent.length > 0 && (
							<>
								<KText
									bold
									text={translate('fw.recentRegisterPicker.recents')}
								/>
								<View style={styles.line} />
								<View style={styles.listView}>
									{listRecent.map(x => (
										<View style={styles.listItemCard} key={x.id}>
											<KText
												bold
												style={styles.listItemText}
												text={x.name}
											/>
										</View>
									))}
								</View>
							</>
						)}
						<KText bold text={listLabel} />
						<View style={styles.line} />
						<View style={styles.searchView}>
							<SvgXml style={styles.searchIcon} xml={svgSearch} />
							<TextInput
								onBlur={onCloseKeyboard}
								onFocus={onOpenKeyboard}
								onCl
								placeholder={translate(
									'fw.recentRegisterPicker.search',
								)}
								style={styles.searchText}
							/>
						</View>
						<View style={styles.listView}>
							{list.map(x => (
								<View style={styles.listItemCard} key={x.id}>
									<KText
										bold
										style={styles.listItemText}
										text={x.name}
									/>
								</View>
							))}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</Modal>
		</>
	)
}

export default RecentRegisterPicker
