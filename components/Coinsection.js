import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CoinNav from './CoinNav'
import TxnHistory from './TxnHistory'

const Coinsection = () => {
  return (
    <View style={styles.coinContainer}>

      <CoinNav />
      <TxnHistory />
    </View>
  )
}

export default Coinsection

const styles = StyleSheet.create({
  coinContainer: {
    flex: 2,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})
