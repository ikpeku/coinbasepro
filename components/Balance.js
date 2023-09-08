import React, { useEffect, useState, useMemo } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { View, StyleSheet, Text } from "react-native"
import { db } from '../firebase/firebaseConfig'
import { auth } from '../firebase/firebaseConfig'

const Balance = () => {
  const [balance, setBalance] = useState("")
  const [coin, setCoin] = useState("")



  useEffect(() => {

    const refDoc = doc(db, "users", auth?.currentUser?.uid)
    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists) {
        const { amount, name } = snapshot?.data()?.selectedCoin
        setBalance(amount)
        setCoin(name)
      }
    })

    return () => unsub()
  }, [])

  useMemo(() => {
    if (balance !== 0) {
      setBalance(balance)
    }
  }, [])



  return (
    <View style={styles.BalanceContainer}>
      <Text style={styles.contain1}>${!balance ? "00:00" : balance === 0 ? "00:00" : `${balance?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</Text>
      <Text style={styles.contain2}>{coin}</Text>
    </View>
  )
}

export default Balance


const styles = StyleSheet.create({
  BalanceContainer: {

    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',


  },
  contain1: {
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 35,
    color: "#fff"
  },
  contain2: {
    justifyContent: "center",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },
});
