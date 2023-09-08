import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { auth, db } from '../firebase/firebaseConfig'
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';

const TxnHistory = () => {
  const [trnHistory, setTransaction] = useState([])
  const [loading, setLoading] = useState(false)




  useEffect(() => {
    setLoading(true)
    const refDoc = doc(db, "users", auth.currentUser.uid)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const { transactions } = snapshot?.data()
        setTransaction(transactions.sort((a, b) => a.time < b.time))
        setLoading(false)
      }
    })
    return () => unsub()

  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={'large'} color="#3376bc" />
      </View>
    )
  }



  return (
    <View style={{ flex: 1, backgroundColor: "#f1f2f7" }}>
      {trnHistory.length === 0 ? <Text style={styles.noTxn}>No transaction</Text> :
        <FlashList
          data={trnHistory}
          renderItem={({ item }) => {



            return (
              <View style={{ backgroundColor: "#fff", marginVertical: 5, flexDirection: "row", alignItems: "center" }}>
                {item.type === "deposit" ? <MaterialIcons name="call-received" size={24} color="green" /> :
                  <MaterialCommunityIcons name="call-made" size={24} color="red" />}


                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 2 }}>

                  <View>
                    <Text style={{ padding: 5, color: "#3376bc", fontWeight: "bold", fontSize: 16 }}>{item.type}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={item.type === "deposit" ? { padding: 5, color: "green" } : { padding: 5, color: "red" }}>{item?.type === "deposit" ? "+" : "-"}{item?.amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                      <Text style={{ padding: 5, color: "#3376bc" }}>{item.name}</Text>
                    </View>

                  </View>


                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ padding: 5, color: "#3376bc" }}>{moment(item.time.toDate()).fromNow()}</Text>

                    <Text style={[{ padding: 5 }, item.status ? { color: "green" } : { color: "red" }]}>{!item.status ? "Pending" : "Approved"}</Text>
                  </View>


                </View>
              </View>
            )
          }}
          estimatedItemSize={20}
        // keyExtractor={item => item.id}
        />}

    </View>
  )
}

export default TxnHistory

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: "#FAF9F6"
  },
  noTxn: {
    textAlign: "center",
    padding: 5
  }
})
