import React from 'react'
import {View} from 'react-native'
import {translate} from 'src/i18n/translate'
import styles from './styles'
import orderStatus from 'src/enums/order'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import CheckBox from '@react-native-community/checkbox'
import AddProduct from 'src/components/ceasa/sell/add-product'
import TotalSegment from 'src/components/ceasa/sell/total-segment'
import ClientSegment from 'src/components/ceasa/sell/client-segment'
import MissingItemsModal from 'src/components/ceasa/sell/missing-items-modal'
import ProductListSegment from 'src/components/ceasa/sell/product-list-segment'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'

const SellComponent = ({
    client,
    errors,
    clients,
    working,
    status,
    setClient,
    addProduct,
    clientStep,
    orderItems,
    totalPrice,
    handlePress,
    handleClear,
    openAddMenu,
    editProduct,
    missingItems,
    storageItems,
    generateLoad,
    removeProduct,
    setOpenAddMenu,
    setMissingItems,
    setGenerateLoad,
    setReleasedStatus,
}) => {
    return (
        <ScreenBase
            useScroll={false}
            useKeyboardAvoid={false}
            useKeyboardClose={false}>
            <Button
                onPress={handleClear}
                label={translate('sell.restart')}
                disabled={
                    !orderItems || (orderItems && orderItems.length === 0)
                }
            />
            {clientStep ? (
                <CloseKeyboardView style={styles.clientView}>
                    <ClientSegment
                        client={client}
                        errors={errors}
                        clients={clients}
                        setClient={setClient}
                    />
                </CloseKeyboardView>
            ) : (
                <ProductListSegment
                    style={styles.items}
                    orderItems={orderItems}
                    editProduct={editProduct}
                    storageItems={storageItems}
                    removeProduct={removeProduct}
                />
            )}
            <View style={styles.footer}>
                <TotalSegment
                    totalPrice={totalPrice}
                    setOpenAddMenu={!clientStep ? setOpenAddMenu : undefined}
                />
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
                        onValueChange={(checked) => {
                            setGenerateLoad(checked)
                            if (!checked) {
                                setReleasedStatus(false)
                            }
                        }}
                    />
                </View>
                <View style={styles.row}>
                    <KText
                        bold
                        style={styles.rowAlignText}
                        text={translate('sell.released')}
                    />
                    <CheckBox
                        disabled={!generateLoad}
                        style={styles.checkbox}
                        value={status === orderStatus.released}
                        onValueChange={(checked) => setReleasedStatus(checked)}
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
                removeProduct={removeProduct}
                storageItems={storageItems}
                alreadyAddedProducts={orderItems}
            />
            <MissingItemsModal
                missingItems={missingItems}
                setMissingItems={setMissingItems}
            />
        </ScreenBase>
    )
}

export default SellComponent
