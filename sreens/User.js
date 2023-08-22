import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, TextInput, Alert, Pressable, FlatList, ActivityIndicator } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase/firebaseConfig';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';



const User = ({ route }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const { Name, accountName, DOB, Email, Register, accountNumber, bankName, licence, passport, phoneNumber, licenceBack, swiftCode, Deposit, Withdraw, selectedCoin, transactions, token } = data

  const sortTransaction = transactions?.sort((a, b) => a.time < b.time)


  useEffect(() => {
    setIsLoading(true)
    const refDoc = doc(db, "users", route?.params?.id)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot?.data()
        setData(data)

      }
    })
    setIsLoading(false)
    return () => unsub()
  }, [])





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

  const setRemoveTransList = async (item) => {

    // update transction list
    const newList = [...transactions]
    const req = newList.findIndex(tran => tran.id === item.id)
    newList[req] = { ...newList[req], status: false }
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
              amount: +selectedCoin.amount - +item.amount,
            }
          })
        } else {
          await updateDoc(userRef, {
            selectedCoin: {
              ...selectedCoin,
              amount: +selectedCoin.amount + +item.amount,
            }
          })
        }

      }


      const newToken = { ...token }
      newToken[item.name] = item.type === "deposit" ? +newToken[item.name] - +item.amount : +newToken[item.name] + +item.amount
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


  const handleImagesSubmit = async ({ type }) => {


    // setUploadError(false)
    const userRef = doc(db, "users", auth.currentUser?.uid)

    try {

      if (type === "getPassport") {
        await updateDoc(userRef, { passport: "" })
      }

      if (type === "getLicence") {
        await updateDoc(userRef, { licence: "" })
      }


      if (type === "getLicenceBack") {
        await updateDoc(userRef, { licenceBack: "" })
      }




    } catch (e) {
      Toast.show("fail to upload doc", {
        textColor: "red",
        duration: Toast.durations.SHORT
      })
    }


  }




  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={'large'} color="#3376bc" />
      </View>
    )
  }




  return (
    <SafeAreaView style={{ marginHorizontal: 5, flex: 1 }}>

      <View style={{ minHeight: 50, paddingBottom: 30, flex: 1 }}>

        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.Text}>Name: {Name}</Text>
              <Text style={styles.Text}>D.O.B. : {DOB?.toDate().toLocaleDateString()}</Text>
              <Text style={styles.Text}>Email: {Email}</Text>
              <Text style={styles.Text}>Register: {Register?.toDate().toLocaleDateString()}</Text>
              <Text style={styles.Text}>Account Name: {accountName}</Text>
              <Text style={styles.Text}>Account Number: {accountNumber}</Text>
              <Text style={styles.Text}>Bank Name: {bankName}</Text>
              <Text style={styles.Text}>phone Number: {phoneNumber}</Text>
              <Text style={styles.Text}>swift code: {swiftCode}</Text>


              {licence && <Pressable
                onPress={() =>
                  Alert.alert('Avatar', `Do you want to remove licence-front photo?`, [
                    {
                      text: 'Cancel',
                      style: 'No',
                    },
                    { text: 'Yes', onPress: () => handleImagesSubmit({ type: "getLicence" }) },
                  ])
                }
                style={{ marginVertical: 20 }}>
                <Text style={styles.Text}>Licence front: </Text>
                <Image
                  source={{ uri: licence }} style={{ height: 200, margin: 5 }} />
              </Pressable>}

              {licenceBack && <Pressable
                onPress={() =>
                  Alert.alert('Avatar', `Do you want to remove licence-back photo?`, [
                    {
                      text: 'Cancel',
                      style: 'No',
                    },
                    { text: 'Yes', onPress: () => handleImagesSubmit({ type: "getLicenceBack" }) },
                  ])
                }
                style={{ marginVertical: 20 }}>
                <Text style={styles.Text}>licenceBack: </Text>
                <Image
                  source={{ uri: licenceBack }} style={{ height: 200, margin: 5 }} />
              </Pressable>}

              {passport && <Pressable
                onPress={() =>
                  Alert.alert('Avatar', `Do you want to remove passport photo?`, [
                    {
                      text: 'Cancel',
                      style: 'No',
                    },
                    { text: 'Yes', onPress: () => handleImagesSubmit({ type: "getPassport" }) },
                  ])
                }
                style={{ marginVertical: 20 }}>
                <Text style={styles.Text}>passport: </Text>
                <Image
                  source={{ uri: passport }} style={{ height: 200, margin: 5 }} />
              </Pressable>}

              <Text style={[styles.Text, { color: "green", marginTop: 30 }]}>Transactions List:</Text>

            </>
          }

          data={sortTransaction}
          renderItem={({ item }) => (
            <Pressable onPress={() =>

              Alert.alert('Transaction', `Do you want to ${item.status ? "disapprove" : "approve"} ${item?.amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} transaction?`, [
                {
                  text: 'Cancel',
                  // onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'OK', onPress: !item.status ? () => setTransList(item) : () => setRemoveTransList(item) },
                { text: 'copy', onPress: () => Clipboard.setStringAsync(item.Address) },
              ])
            }

              style={{ flexDirection: "column", justifyContent: "space-between", marginVertical: 5, marginHorizontal: 10, borderWidth: 1, paddingHorizontal: 4, minHeight: 16 }} >

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                <Text style={{ color: "#3376bc", fontSize: 22, fontWeight: "bold" }}>{item?.name}</Text>
                <Text style={{ color: "#3376bc", fontSize: 16 }}>${item?.amount}</Text>
                <Text style={{ color: "#3376bc", fontSize: 16 }}>{item?.type}</Text>
                <Text style={[{ fontSize: 18 }, item.status ? { color: "green", } : { color: "red" }]}>{item?.status ? "approved" : "pending"}</Text>
              </View>
              {item.Address && <Text style={{ color: "#3376bc", fontSize: 18 }}>Address: {item?.Address}</Text>}

            </Pressable>
          )}
        />
      </View>
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