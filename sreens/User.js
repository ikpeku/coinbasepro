import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, TextInput, Alert, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase/firebaseConfig';
import { FlashList } from '@shopify/flash-list';

const User = ({ route }) => {

  const [data, setData] = useState([])
  const { Name, accountName, DOB, Email, Register, accountNumber, bankName, licence, passport, phoneNumber, licenceBack, swiftCode, Deposit, Withdraw, selectedCoin, transactions, token } = data

  const sortTransaction = transactions?.sort((a, b) => a.time < b.time)

  // const [selectedCoinAmount, setSeleted] = useState(selectedCoin?.amount)

  // const [BNB, setBNB] = useState("")
  // const [BTC, setBTC] = useState("")
  // const [ETH, setETH] = useState("")
  // const [LTC, setLTC] = useState("")
  // const [USDT, setUSDT] = useState("")


  // const handleSelected = async () => {
  //   const userRef = doc(db, "users", route?.params?.id)

  //   try {
  //     await updateDoc(userRef, {
  //       selectedCoin: {
  //         amount: selectedCoinAmount,
  //       }
  //     })

  //     Alert.alert("done")

  //   } catch (error) {
  //     Alert.alert("error occurred try again")
  //   }
  // }


  useEffect(() => {

    const refDoc = doc(db, "users", route?.params?.id)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        // const { BNB, BTC, ETH, LTC, USDT } = snapshot?.data()?.token
        // setBNB(BNB)
        // setBTC(BTC)
        // setETH(ETH)
        // setLTC(LTC)
        // setUSDT(USDT)

        // const { amount } = snapshot?.data()?.selectedCoin
        // setSeleted(amount)

        const data = snapshot?.data()

        setData(data)

      }
    })

    return () => unsub()
  }, [])


  // const verifyDeposit = async () => {
  //   const userRef = doc(db, "users", route?.params?.id)

  //   try {
  //     await updateDoc(userRef, {
  //       Deposit: {
  //         status: false,
  //       }

  //     })

  //     Alert.alert("done")

  //   } catch (error) {
  //     Alert.alert("error occurred try again")
  //   }

  // }

  // const verifyWithdraw = async () => {
  //   const userRef = doc(db, "users", route?.params?.id)
  //   try {
  //     await updateDoc(userRef, {
  //       Withdraw: {
  //         status: false,
  //       }
  //     })
  //     Alert.alert("done")
  //   } catch (error) {
  //     Alert.alert("error occurred try again")
  //   }
  // }


  // const verifyToken = async () => {
  //   const userRef = doc(db, "users", route?.params?.id)
  //   try {
  //     await updateDoc(userRef, {
  //       token: {
  //         BTC: BTC, BNB: BNB, LTC: LTC, USDT: USDT, ETH: ETH
  //       }
  //     })
  //     Alert.alert("done")
  //   } catch (error) {
  //     Alert.alert("error occurred try again")
  //   }
  // }


  const setTransList = async (item) => {

    // update transction list
    const newList = [...transactions]
    const req = newList.findIndex(tran => tran.id === item.id)
    newList[req] = { ...newList[req], status: true }
    const userRef = doc(db, "users", route?.params?.id)



    try {
      await updateDoc(userRef, {
        transactions: newList
      })

      if (item.name === selectedCoin.name) {
        if (item.type === "deposit") {
          await updateDoc(userRef, {
            selectedCoin: {
              ...selectedCoin,
              amount: +selectedCoin.amount + +item.amount,
            }
          })
        } else {
          await updateDoc(userRef, {
            selectedCoin: {
              ...selectedCoin,
              amount: +selectedCoin.amount - +item.amount,
            }
          })
        }

      }


      const newToken = { ...token }
      newToken[item.name] = item.type === "deposit" ? +newToken[item.name] + +item.amount : +newToken[item.name] - +item.amount
      await updateDoc(userRef, {
        token: {
          ...newToken
        }
      })

      Alert.alert("done")

    } catch (error) {
      Alert.alert("error occurred try again")

    }


  }




  return (
    <SafeAreaView style={{ marginHorizontal: 5, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.Text}>Name: {Name}</Text>
        <Text style={styles.Text}>D.O.B. : {DOB?.toDate().toLocaleDateString()}</Text>
        <Text style={styles.Text}>Email: {Email}</Text>
        <Text style={styles.Text}>Register: {Register?.toDate().toLocaleDateString()}</Text>
        <Text style={styles.Text}>Account Name: {accountName}</Text>
        <Text style={styles.Text}>Account Number: {accountNumber}</Text>
        <Text style={styles.Text}>Bank Name: {bankName}</Text>
        <Text style={styles.Text}>phone Number: {phoneNumber}</Text>
        <Text style={styles.Text}>swift code: {swiftCode}</Text>


        {licence && <View style={{ marginVertical: 20 }}>
          <Text style={styles.Text}>Licence front: </Text>
          <Image source={{ uri: licence }} style={{ height: 200, margin: 5 }} />
        </View>}

        {licenceBack && <View style={{ marginVertical: 20 }}>
          <Text style={styles.Text}>licenceBack: </Text>
          <Image source={{ uri: licenceBack }} style={{ height: 200, margin: 5 }} />
        </View>}

        {passport && <View style={{ marginVertical: 20 }}>
          <Text style={styles.Text}>passport: </Text>
          <Image source={{ uri: passport }} style={{ height: 200, margin: 5 }} />
        </View>}




        {/* 
        {Deposit?.status && <>
          <Text style={[styles.Text, { color: "green", marginTop: 10 }]}>Deposit:</Text>
          <Text style={styles.Text}>status: {Deposit?.status ? "Requesting verification" : "Has been verify"}</Text>
          <Text style={styles.Text}>Deposit amount: {Deposit?.amount}</Text>

          <Button
            onPress={verifyDeposit}
            disabled={!Deposit.status}
            title="Verify deposit"
            color="#3376bc"
            accessibilityLabel="Learn more about this blue button"
          />
        </>} */}

        {/* {Withdraw?.status && <>
          <Text style={[styles.Text, { color: "green", marginTop: 30 }]}>Withdrawal:</Text>
          <Text style={styles.Text}>status: {Withdraw?.status ? "Requesting verification" : "settle"}</Text>
          <Text style={styles.Text}>Withdraw amount: {Withdraw?.amount}</Text>
          <Text style={styles.Text}>Withdraw to Address: {Withdraw?.Address}</Text>


          <Button
            onPress={verifyWithdraw}
            disabled={!Withdraw.status}
            title="Verify withdrawal"
            color="#3376bc"
            accessibilityLabel="Learn more about this blue button"
          />
        </>} */}


        {/* <View style={{ flexDirection: "row", marginVertical: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Selected Coin: </Text>
          <View style={{ flex: 1 }}>
            <TextInput value={selectedCoinAmount} onChangeText={(text) => setSeleted(text)} multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} />

            <Text style={{ fontSize: 18, fontFamily: "Nunito-Medium", textAlign: "center" }}> {selectedCoin?.name}</Text>

            <Button
              onPress={handleSelected}
              // disabled={!Withdraw.status}
              title="update balance"
              color="#3376bc"
              accessibilityLabel="Learn more about this blue button"
            />

          </View>
        </View> */}



        {/* <View style={{ marginBottom: 50 }}>
          <Text style={[styles.Text, { color: "green", marginTop: 30 }]}>Token: </Text>

          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>BNB : </Text>
            <View style={{ flex: 1 }}>
              <TextInput value={BNB} onChangeText={(text) => setBNB(text)} multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} />
              <Text style={{ fontSize: 18, fontFamily: "Nunito-Medium", textAlign: "center" }}>BNB Available: {BNB}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>BTC : </Text>
            <View style={{ flex: 1 }}>
              <TextInput value={BTC} onChangeText={(text) => setBTC(text)} multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} />
              <Text style={{ fontSize: 18, fontFamily: "Nunito-Medium", textAlign: "center" }}>BTC Available: {BTC}</Text>
            </View>
          </View>


          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>ETH : </Text>
            <View style={{ flex: 1 }}>
              <TextInput value={ETH} onChangeText={(text) => setETH(text)} multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} />
              <Text style={{ fontSize: 18, fontFamily: "Nunito-Medium", textAlign: "center" }}>ETH Available: {ETH}</Text>
            </View>
          </View>


          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>LTC : </Text>
            <View style={{ flex: 1 }}>
              <TextInput value={LTC} onChangeText={(text) => setLTC(text)} multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} />
              <Text style={{ fontSize: 18, fontFamily: "Nunito-Medium", textAlign: "center" }}>LTC Available: {LTC} </Text>
            </View>
          </View>


          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>USDT: </Text>
            <View style={{ flex: 1 }}>
              <TextInput value={USDT} onChangeText={(text) => setUSDT(text)} multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} />
              <Text style={{ fontSize: 18, fontFamily: "Nunito-Medium", textAlign: "center" }}>USDT Available: {USDT}</Text>
            </View>
          </View>
          <Button
            onPress={verifyToken}
            // disabled={!Withdraw.status}
            title="Set Token"
            color="#3376bc"
            accessibilityLabel="Learn more about this blue button"
          />

        </View> */}


        <View style={{ minHeight: 50, paddingBottom: 30, flex: 1 }}>
          <Text style={[styles.Text, { color: "green", marginTop: 30 }]}>Transactions List:</Text>
          <FlashList

            estimatedItemSize={5}
            // keyExtractor={(item) => item.id}

            data={sortTransaction}
            renderItem={({ item }) => (
              <Pressable disabled={item.status} onPress={() => setTransList(item)} style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 3, marginHorizontal: 10, alignItems: "center", borderWidth: 1, paddingHorizontal: 4, minHeight: 16 }} >
                <Text style={{ color: "#3376bc", fontSize: 22, fontWeight: "bold" }}>{item?.name}</Text>
                <Text style={{ color: "#3376bc", fontSize: 16 }}>${item?.amount}</Text>
                <Text style={{ color: "#3376bc", fontSize: 16 }}>{item?.type}</Text>
                <Text style={{ color: "#3376bc", fontSize: 18 }}>{item?.status ? "approved" : "pending"}</Text>
                {/* <Pressable onPress={() => navigation.navigate("user", { user: item.users, id: item.id })}>
                <Text style={{ color: "#3376bc", fontSize: 22, fontWeight: "bold" }}>{item.id === "FmWNlv1V8LPy27CaEbCiannFw8Z2" ? "Admin" : item.users.Name}</Text>
              </Pressable>

              <Button disabled={item.id === "FmWNlv1V8LPy27CaEbCiannFw8Z2"} onPress={() => onDeletePress(item)} title='delete' /> */}
              </Pressable>
            )}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    marginVertical: 2
  }
})

export default User