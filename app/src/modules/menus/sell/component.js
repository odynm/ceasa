import React from 'react'
import { translate } from 'src/i18n/translate'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import ItemCard from './components/item-card'
import Button from 'src/components/fw/button'
import AddProduct from './components/add-product'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'
import CheckBox from '@react-native-community/checkbox'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'
import ClientSegment from 'src/components/ceasa/sell/client-segment'

const SellComponent = ({
	client,
	errors,
	working,
	released,
	setClient,
	addProduct,
	clientStep,
	orderItems,
	totalPrice,
	handlePress,
	handleClear,
	openAddMenu,
	setReleased,
	generateLoad,
	setOpenAddMenu,
	setGenerateLoad,
	storedItemsOrderAware,
}) => {
	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<Button
				onPress={handleClear}
				label={translate('sell.restart')}
				disabled={!orderItems || (orderItems && orderItems.length === 0)}
			/>
			{clientStep ? (
				<CloseKeyboardView style={styles.clientView}>
					<ClientSegment client={client} setClient={setClient} />
				</CloseKeyboardView>
			) : (
				<ScrollView style={styles.items}>
					{orderItems && orderItems.length > 0 ? (
						orderItems.map((item, index) => (
							<ItemCard
								key={index}
								total={item.total}
								amount={item.amount}
								unitPrice={item.unitPrice}
								product={item.productName}
								description={item.description}
								productType={item.productTypeName}
							/>
						))
					) : (
						<KText
							style={styles.centerText}
							text={translate('sell.noItemsAdded')}
						/>
					)}
				</ScrollView>
			)}
			<View style={styles.footer}>
				<View style={styles.totalRow}>
					<View style={styles.totalRowInside}>
						<KText
							bold
							fontSize={24}
							style={styles.rowAlignText}
							text={`${translate('sell.total')} `}
						/>
						<KText
							bold
							fontSize={24}
							style={styles.rowAlignText}
							text={`${MoneyService.getCurrency().text} ${
								totalPrice.text
							}`}
						/>
					</View>
					{!clientStep && (
						<TouchableOpacity
							onPress={() => setOpenAddMenu(true)}
							style={styles.addButton}>
							<KText fontSize={24} text={'+'} />
						</TouchableOpacity>
					)}
				</View>
				<Space />
				<View style={styles.row}>
					<KText
						bold
						style={styles.rowAlignText}
						text={translate('sell.generateLoad')}
					/>
					<CheckBox
						value={generateLoad}
						style={styles.checkbox}
						onValueChange={checked => setGenerateLoad(checked)}
					/>
				</View>
				<View style={styles.row}>
					<KText
						bold
						style={styles.rowAlignText}
						text={translate('sell.released')}
					/>
					<CheckBox
						value={released}
						style={styles.checkbox}
						onValueChange={checked => setReleased(checked)}
					/>
				</View>
				<Space size2 />
				{working ? (
					<Loader />
				) : (
					<Button
						label={
							clientStep
								? translate('sell.addSell')
								: translate('sell.continue')
						}
						onPress={handlePress}
					/>
				)}
			</View>
			<AddProduct
				open={openAddMenu}
				addProduct={addProduct}
				setOpen={setOpenAddMenu}
				items={storedItemsOrderAware}
			/>
		</ScreenBase>
	)
}

export default SellComponent
