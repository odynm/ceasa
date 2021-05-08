import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { ScrollView, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as HomeCreators } from 'src/ducks/home'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import ItemCardHome from './item-card-home'
import Space from 'src/components/fw/space'
import screens from 'src/constants/screens'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import MoneyService from 'src/services/moneyService'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import ConfirmationModal from 'src/components/fw/confirmation-modal'

const Home = ({
    loading,
    balance,
    overview,
    loadHome,
    navigation,
    resetStorage,
    noConnection,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        loadHome()
    }, [])

    const handleDeleteStorage = async () => {
        await resetStorage()
    }

    const openAdditionalCost = () => {
        navigation.navigate(screens.additionalCost)
    }

    return (
        <>
            {loading && (!overview || overview.length === 0) ? (
                <Loader fullScreen />
            ) : (
                <ScreenBase
                    useScroll={false}
                    useKeyboardAvoid={false}
                    useKeyboardClose={false}>
                    <Button
                        small
                        disabled={noConnection}
                        label={translate('home.deleteStorage')}
                        onPress={() => setConfirmDelete(true)}
                    />
                    <View style={styles.container}>
                        {noConnection ? (
                            <View style={[styles.align, styles.placeholder]}>
                                <KText
                                    text={translate(
                                        'home.noBalanceWhenNoConnection',
                                    )}
                                />
                                <Space size2 />
                            </View>
                        ) : (
                            <>
                                <KText
                                    bold
                                    fontSize={20}
                                    text={translate('home.dailyBalance')}
                                />
                                <View style={styles.row}>
                                    <KText
                                        text={translate('home.totalEntries')}
                                    />
                                    <KText
                                        text={`${
                                            MoneyService.getCurrency().text
                                        } ${
                                            MoneyService.toMoney(
                                                balance.totalEarned
                                                    ? balance.totalEarned / 100
                                                    : 0,
                                            ).text
                                        }`}
                                    />
                                </View>
                                <View style={styles.row}>
                                    <KText
                                        text={translate('home.totalExpenses')}
                                    />
                                    <KText
                                        text={`${
                                            MoneyService.getCurrency().text
                                        } ${
                                            MoneyService.toMoney(
                                                balance.totalCostPrice
                                                    ? balance.totalCostPrice /
                                                          100
                                                    : 0,
                                            ).text
                                        }`}
                                    />
                                </View>
                                <View style={styles.row}>
                                    <KText
                                        bold
                                        text={translate('home.totalProfit')}
                                    />
                                    <KText
                                        bold
                                        text={`${
                                            MoneyService.getCurrency().text
                                        } ${
                                            MoneyService.toMoney(
                                                balance.totalProfit
                                                    ? balance.totalProfit / 100
                                                    : 0,
                                            ).text
                                        }`}
                                    />
                                </View>
                                <Space size2 />
                            </>
                        )}
                        <View style={styles.flexRowEnd}>
                            <Button
                                tiny
                                label={translate('home.addAdditionalCost')}
                                onPress={() => openAdditionalCost()}
                            />
                        </View>
                        {noConnection ? (
                            <View />
                        ) : (
                            <>
                                <KText
                                    bold
                                    style={styles.details}
                                    fontSize={20}
                                    text={translate('home.details')}
                                />
                                <ScrollView style={styles.scrollView}>
                                    {overview && overview.length > 0 ? (
                                        overview.map(item => (
                                            <View key={item.id}>
                                                <ItemCardHome
                                                    sold={item.sold}
                                                    amount={item.amount}
                                                    product={item.productName}
                                                    costPrice={item.costPrice}
                                                    description={
                                                        item.description
                                                    }
                                                    totalEarned={
                                                        item.totalEarned
                                                    }
                                                    liquidEarned={
                                                        item.liquidEarned
                                                    }
                                                    productType={
                                                        item.productTypeName
                                                    }
                                                    startingTotalItems={
                                                        item.startingTotalItems
                                                    }
                                                />
                                            </View>
                                        ))
                                    ) : (
                                        <KText text={translate('home.empty')} />
                                    )}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </ScreenBase>
            )}
            {/* <KModal
				size={250}
				open={showModalEndDay}
				onClose={() => setShowModalEndDay(false)}
				header={translate('home.modalAccept.header')}>
				<View style={styles.flex}>
					<KText text={translate('home.modalAccept.content')} />
				</View>
				<View style={styles.buttons}>
					<Button
						tiny
						onPress={() => setConfirmRetain(false)}
						label={translate('home.modalAccept.dontDeleteStorage')}
					/>
					<Button
						tiny
						onPress={() => setConfirmRetain(true)}
						label={translate('home.modalAccept.deleteStorage')}
					/>
				</View>
			</KModal> */}
            <ConfirmationModal
                open={confirmDelete}
                onAccept={() => {
                    setConfirmDelete(false)
                    handleDeleteStorage(false)
                }}
                onClose={() => setConfirmDelete(false)}
                header={translate('home.modalAccept.headerDelete')}
                content={translate('home.modalAccept.contentDelete')}
            />
        </>
    )
}

Home.navigationOptions = () => ({
    title: translate('menus.home'),
    headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapDispatchToProps = {
    loadHome: HomeCreators.loadHome,
    resetStorage: HomeCreators.resetStorage,
}

const mapStateToProps = ({ app, home }) => ({
    loading: home.loading,
    balance: home.balance,
    overview: home.overview,
    noConnection: app.noConnection,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withNavigation(Home))
