import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useState, useRef, useMemo} from 'react'
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ListItems from '../marketComponents/Listiems'
import { getMarketData } from '../marketComponents/MarketData'
import Chart from '../marketComponents/Chart'

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';


const ListHeader = () => (
  <>
    <View style={styles.titleWrapper}>
        <Text style={styles.largeTitle}>Markets</Text>
      </View>
    <View style={styles.divider} />
  </>
)



const SettingScreen = () => { 
  const [data, setData] = useState([])
  const [selectedCoinData, setSelectedCoinData] = useState(null);
 






  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['30%'], []);

  const openModal = (item) => {
    setSelectedCoinData(item)
    bottomSheetModalRef.current.present();

  }


  useEffect(() => {
  

    const fetchMarketData = async () => {
      const marketData = await getMarketData();
      setData(marketData);
    }

    fetchMarketData();


  }, [])



  return (
    <BottomSheetModalProvider>
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
    {data.length === 0 && <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size={'large'}  color="#3376bc" />
      </View>}
      {data.length !== 0 &&<FlashList
      estimatedItemSize={10}
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({ item }) => (
          <ListItems
            name={item.name}
            symbol={item.symbol}
            currentPrice={item.current_price}
            priceChangePercentage7d={item.price_change_percentage_7d_in_currency}
            logoUrl={item.image}
            onPress={() => openModal(item)}
          />
        )}
        ListHeaderComponent={<ListHeader />}
      />}
      </SafeAreaView>


      <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={styles.bottomSheet}
        >
          { selectedCoinData ? (
          <Chart
            currentPrice={selectedCoinData.current_price}
            logoUrl={selectedCoinData.image}
            name={selectedCoinData.name}
            symbol={selectedCoinData.symbol}
            priceChangePercentage7d={selectedCoinData.price_change_percentage_7d_in_currency}
            sparkline={selectedCoinData?.sparkline_in_7d.price}
          />
        ) : null}
        </BottomSheetModal>

      </BottomSheetModalProvider>
  )
}

export default SettingScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  largeTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3376bc",
    fontFamily: 'Nunito-Bold',
            // fontWeight: "bold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});