import React, { useState, useEffect } from 'react'
import {
	View,
	TextInput,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
} from 'react-native'
import { SvgXml } from 'react-native-svg'
import { translate } from 'src/i18n/translate'
import styles from './styles'
import Picker from '../picker'
import Modal from 'react-native-modal'
import KText from 'src/components/fw/ktext'
import svgSearch from 'res/svgs/v9/svgSearch.svg'
import KeyboardService from 'src/services/keyboardService'

const RecentRegisterPicker = ({
	list,
	label,
	loading,
	disabled,
	listLabel,
	selectedId,
	listRecent,
	errorMessage,
	setSelectedId,
	labelNotRegistered,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

	useEffect(() => {
		KeyboardService.subscribeHide(onKeyboardHide)
	}, [])

	const setSelected = item => {
		setSelectedId(item.id)
		setIsOpen(false)
	}

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
			<Picker
				label={label}
				loading={loading}
				disabled={disabled}
				errorMessage={errorMessage}
				selected={list && list.find(x => x.id === selectedId)?.name}
				onPress={() => setIsOpen(true)}
			/>
			<Modal
				isVisible={isOpen}
				onRequestClose={() => setIsOpen(false)}
				onBackdropPress={() => setIsOpen(false)}
				backdropOpacity={0.4}>
				<KeyboardAvoidingView
					style={
						isKeyboardOpen
							? {
									...styles.openContainer,
									...styles.containerSmall,
							  }
							: styles.openContainer
					}>
					<TouchableOpacity>
						{/* TODO: make this button work*/}
						<KText
							bold
							link
							text={labelNotRegistered}
							style={styles.labelNotRegistered}
						/>
					</TouchableOpacity>
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
										<TouchableOpacity
											onPress={() => setSelected(x)}
											key={x.id}>
											<View style={styles.listItemCard}>
												<KText
													key={x.id}
													bold
													style={styles.listItemText}
													text={x.name}
												/>
											</View>
										</TouchableOpacity>
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
								placeholder={translate(
									'fw.recentRegisterPicker.search',
								)}
								style={styles.searchText}
							/>
						</View>
						<View style={styles.listView}>
							{list.map(x => (
								<TouchableOpacity
									onPress={() => setSelected(x)}
									key={x.id}>
									<View style={styles.listItemCard}>
										<KText
											key={x.id}
											bold
											style={styles.listItemText}
											text={x.name}
										/>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</Modal>
		</>
	)
}

export default RecentRegisterPicker
