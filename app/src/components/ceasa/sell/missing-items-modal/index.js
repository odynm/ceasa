import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {translate} from 'src/i18n/translate'
import {View, ScrollView} from 'react-native'
import {Creators as ProductCreators} from 'src/ducks/products'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import KModal from 'src/components/fw/kmodal'
import Button from 'src/components/fw/button'

const MissingItemsModal = ({
    onFinish,
    products,
    productTypes,
    loadProducts,
    missingItems,
    setMissingItems,
}) => {
    const [missingItemsWithText, setMissingItemsWithText] = useState([])

    useEffect(() => {
        if (
            !products ||
            products.length === 0 ||
            !productTypes ||
            products.length === 0
        ) {
            loadProducts()
        }
    }, [])

    useEffect(() => {
        const arr = []
        missingItems.map((item) => {
            arr.push({
                productName: products.find((x) => x.id === item.productId).name,
                productTypeName:
                    productTypes.find((x) => x.id === item.productTypeId)
                        ?.name || '',
                description: item.description,
                missingAmount: item.missingAmount,
            })
        })

        setMissingItemsWithText(arr)
    }, [missingItems])

    return (
        <KModal
            size={450}
            open={missingItems?.length > 0}
            onClose={() => {
                if (onFinish) {
                    onFinish()
                }
                setMissingItems([])
            }}
            header={translate('sell.modalMissing.header')}>
            <ScrollView style={styles.scrollview}>
                {missingItemsWithText?.map((missingItem, i) => (
                    <View key={i} style={styles.container}>
                        <View style={styles.row}>
                            <KText
                                bold
                                text={`${missingItem.productName} ${
                                    missingItem.productTypeName
                                }`}
                            />
                        </View>
                        {missingItem.description?.length > 0 ? (
                            <View style={styles.row}>
                                <KText text={missingItem.description} />
                            </View>
                        ) : (
                            undefined
                        )}
                        <View style={styles.row}>
                            <KText
                                style={styles.itemLabel}
                                fontSize={14}
                                text={`${translate(
                                    'sell.modalMissing.missingAmount',
                                )}`}
                            />
                            <KText bold text={`${missingItem.missingAmount}`} />
                        </View>
                    </View>
                ))}
            </ScrollView>
            <Button
                small
                style={styles.button}
                label={'Ok'}
                onPress={() => {
                    setMissingItems([])
                    if (onFinish) {
                        onFinish()
                    }
                }}
            />
        </KModal>
    )
}

const mapStateToProps = ({products}) => ({
    products: products.products,
    productTypes: products.productTypes,
})

const mapDispatchToProps = {
    loadProducts: ProductCreators.loadProducts,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MissingItemsModal)
