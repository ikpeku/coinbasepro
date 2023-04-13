import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { auth, db } from '../firebase/firebaseConfig'
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

const TxnHistory = () => {
  const [trnHistory, setTransaction] = useState([])




  useEffect(() => {
    const refDoc = doc(db, "users", auth.currentUser.uid)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const { transactions } = snapshot?.data()
        setTransaction(transactions.sort((a, b) => a.time < b.time))

      }
    })
    return () => unsub()

  }, [])



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


                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 4 }}>

                  <View>
                    <Text style={{ padding: 5, color: "#3376bc", fontWeight: "bold", fontSize: 16 }}>{item.type}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={item.type === "deposit" ? { padding: 5, color: "green" } : { padding: 5, color: "red" }}>{item?.type === "deposit" ? "+" : "-"}{item?.amount.toLocaleString('en-US', { currency: 'USD' })}</Text>
                      <Text style={{ padding: 5, color: "#3376bc" }}>{item.name}</Text>
                    </View>

                  </View>


                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ padding: 5, color: "#3376bc" }}>{moment(item.time.toDate()).fromNow()}</Text>

                    <Text style={{ padding: 5, color: "green" }}>{!item.status ? "Pending" : "Approved"}</Text>
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
