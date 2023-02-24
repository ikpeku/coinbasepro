import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

const CoinNav = () => {
  return (
    <View style={styles.txnContainer}>
      <Text style={styles.card}>Transaction history</Text>
    </View>
  )
}

export default CoinNav

const styles = StyleSheet.create({
  txnContainer: {
    backgroundColor: '#3376bc',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    overflow: "hidden"
  },
})
