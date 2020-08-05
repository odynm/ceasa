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
import TextInput from 'src/components/fw/text-input'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'
import CheckBox from '@react-native-community/checkbox'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'

const SellComponent = (
	client,
	errors,
	working,
	addProduct,
	setClient,
	clientStep,
	orderItems,
	handlePress,
	handleClear,
	openAddMenu,
	generateLoad,
	setOpenAddMenu,
	setGenerateLoad,
	storedItemsOrderAware,
	totalPrice = { text: '0,00' },
) => {
	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<Button
				onPress={handleClear}
				label={translate('sell.restart')}
				disabled={orderItems || (orderItems && orderItems.length === 0)}
			/>
			{clientStep ? (
				<CloseKeyboardView style={styles.clientView}>
					<TextInput
						value={client.key}
						errorMessage={errors.key}
						label={translate('sell.clientKey')}
						setValue={value => setClient({ ...client, key: value })}
					/>
					<TextInput
						value={client.place}
						label={translate('sell.clientPlace')}
						setValue={value => setClient({ ...client, place: value })}
					/>
					<TextInput
						value={client.vehicle}
						label={translate('sell.clientVehicle')}
						setValue={value => setClient({ ...client, vehicle: value })}
					/>
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
