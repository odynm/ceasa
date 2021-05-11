import React, {useEffect, useState} from 'react'
import {SvgXml} from 'react-native-svg'
import {translate} from 'src/i18n/translate'
import {View, ScrollView, TextInput as RNTextInput} from 'react-native'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import KModal from 'src/components/fw/kmodal'
import svgSearch from 'res/svgs/v13/svgSearch.svg'
import KeyboardService from 'src/services/keyboardService'
import StoredItemCard from 'src/components/ceasa/stored-item-card'
import MergedProductsService from 'src/services/mergedProductsService'

const ProductSelect = ({
    open,
    onClose,
    storageItems,
    selectProduct,
    alreadyAddedProducts,
}) => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
    const [searchString, setSearchString] = useState('')
    const [searchStringUpper, setSearchStringUpper] = useState('')

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
        <KModal
            open={open}
            onClose={onClose}
            header={translate('sell.inStock')}
            size={isKeyboardOpen ? 330 : undefined}>
            <View style={styles.searchView}>
                <SvgXml style={styles.searchIcon} xml={svgSearch} />
                <RNTextInput
                    value={searchString}
                    onChangeText={(t) => {
                        setSearchString(t)
                        setSearchStringUpper(t.toUpperCase())
                    }}
                    onBlur={onCloseKeyboard}
                    onFocus={onOpenKeyboard}
                    placeholder={translate('fw.recentRegisterPicker.search')}
                    style={styles.searchText}
                />
            </View>
            <ScrollView
                keyboardShouldPersistTaps={'handled'}
                onStartShouldSetResponder={() => true}>
                <View onStartShouldSetResponder={() => true}>
                    {storageItems && storageItems.length > 0 ? (
                        storageItems
                            .filter(
                                (x) =>
                                    (x.productName + ' ' + x.productTypeName)
                                        .toUpperCase()
                                        .startsWith(searchStringUpper) &&
                                    (alreadyAddedProducts &&
                                    alreadyAddedProducts.length > 0
                                        ? alreadyAddedProducts.every(
                                              (y) =>
                                                  y.productId !== x.productId ||
                                                  y.productTypeId !==
                                                      x.productTypeId ||
                                                  y.descriptionId !==
                                                      x.descriptionId,
                                          )
                                        : true),
                            )
                            .map((item, index) => (
                                <StoredItemCard
                                    key={index}
                                    amount={item.amount}
                                    isMerged={item.isMerged}
                                    costPrice={
                                        item.isMerged
                                            ? MergedProductsService.calculateMergedPrice(
                                                  item.mergedData.items,
                                              )
                                            : item.costPrice
                                    }
                                    product={item.productName}
                                    description={item.description}
                                    productType={item.productTypeName}
                                    onPress={() => selectProduct(item)}
                                />
                            ))
                    ) : (
                        <View>
                            <KText
                                style={styles.centerText}
                                text={translate('sell.emptyStorage')}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </KModal>
    )
}

export default ProductSelect
