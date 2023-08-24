import React from 'react'
import { Alert, View, Text, SafeAreaView, TouchableOpacity, Share, TextInput, Button } from 'react-native'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import QRCode from 'react-native-qrcode-svg';
import { ScrollView } from 'react-native-gesture-handler';
import { uuidv4 } from '@firebase/util';
import { doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const DepositScreen = ({ route }) => {
  const [copiedText, setCopiedText] = React.useState('');
  const [copiedToken, setCopiedToken] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [token, setToken] = React.useState('');
  const [vericationStatue, setVericationStatus] = React.useState("")
  const [tokenStatue, setTokenStatus] = React.useState(false)
  const [transaction, setTransction] = React.useState([])


  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(route.params?.address)
    fetchCopiedText()
  }



  const fetchCopiedText = async () => {
    await Clipboard.getStringAsync();
    setCopiedText("Address successfully copied.");
    setTimeout(() => {
      setCopiedText("");
    }, 3000);
  };

  const copyToTokenClipboard = async () => {
    await Clipboard.setStringAsync(token)
    fetchCopiedToken()
  }

  const fetchCopiedToken = async () => {
    await Clipboard.getStringAsync();
    setCopiedToken("Token copied.");
    setTimeout(() => {
      setCopiedToken("");
    }, 3000);
  };


  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${route.params?.address}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert("failed", "failed to share file")
    }
  }

  const generteToken = () => {
    if (amount.slice() === "") {
      setTokenStatus(true)

      return
    }
    setTokenStatus(false)

    setToken(uuidv4())
  }

  const verfyDeposit = async () => {
    if (amount.slice() === "") {
      // console.log("enter a valid amount");
      setVericationStatus("Enter a valid amount")
      return
    }

    if (amount.slice() !== "") {

      try {
        const userRef = doc(db, "users", auth.currentUser.uid)
        // const userTransRef = doc(db, "transactions", auth.currentUser.uid)
        // navigation.navigate("Home")

        const timeNow = Timestamp.now()

        await updateDoc(userRef, {
          Deposit: {
            amount: amount,
            status: true,
            type: "deposit"

          },
          transactions: [...transaction, { type: "deposit", amount: amount, status: false, name: route.params?.id, time: timeNow, id: uuidv4() }]


        })

      } catch (error) {
        console.log(error);
        Alert.alert("Deposit status", "failed to verifiy token try again", [
          {
            text: "cancel",
            onPress: () => setToken(""),
          },
          {
            text: "ok",
            onPress: () => setToken(""),
          }
        ])

      }

      // setVericationStatus("Deposit verification pending")
      Alert.alert("Deposit status", "Deposit verification processing", [
        {
          text: "cancel",
          onPress: () => {
            setToken("")
            setAmount("")
          },
        },
        {
          text: "ok",
          onPress: () => {
            setToken("")
            setAmount("")
          },
        }
      ])

    }


  }

  React.useEffect(() => {
    const refDoc = doc(db, "users", auth.currentUser.uid)


    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const { transactions } = snapshot?.data()
        setTransction(transactions)

      }
    })
    return () => unsub()

  }, [])


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3376bc' }}>
      <ScrollView>
        <View style={{ padding: 20, flex: 1 }}>


          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 8, padding: 8 }}>
              <QRCode
                size={200}
                // logoSize={40}
                value={route.params?.address}
              />
              <Text style={{ textAlign: "center", }}>{route.params?.address}</Text>
            </View>
          </View>



          <View style={{ paddingVertical: 25 }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Nunito-Regular',
                textAlign: 'center',
              }}
            >
              Send only {route.params?.title} ({route.params?.id}) to this
              address.
            </Text>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Nunito-Regular',
                textAlign: 'center',
              }}
            >
              Sending any other coins may result in permanent loss.
            </Text>
          </View>

          <View
            style={{
              paddingBottom: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity>
              <Ionicons
                name="ios-share"
                size={24}
                color="#3376bc"
                onPress={onShare}
                style={{
                  backgroundColor: '#fff',
                  marginRight: 10,
                  borderRadius: 10,
                  padding: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={copyToClipboard}>
              <Ionicons
                name="copy"
                size={24}
                color="#3376bc"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          {copiedText && <View>
            <Text style={{
              fontWeight: 'bold',
              color: '#fff',
              fontFamily: 'Nunito-Medium',
              fontSize: 15,
              textAlign: "center",
              marginBottom: 8
            }}>{copiedText}</Text>
          </View>}


          {/* imput deposit amount */}
          <Text style={{
            color: '#fff',
            fontFamily: 'Nunito-Regular',
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold',
          }}>Enter Amount to generate deposit token</Text>

          <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 10 }}>
            <TextInput value={amount} inputMode="decimal" keyboardType="decimal-pad" placeholderTextColor={!tokenStatue ? null : "red"} style={{ backgroundColor: "#fff", color: "#000", padding: 6 }} placeholder="Enter deposit amount" onChangeText={(text) => setAmount(text)} />
            <TouchableOpacity>
              <Button onPress={generteToken} title="generate token" />

            </TouchableOpacity>
          </View>


          {/* generated token */}

          <TouchableOpacity onPress={copyToTokenClipboard}>
            <Text style={{ color: "#fff", textAlign: "center", fontStyle: "italic" }}>{token}</Text>
          </TouchableOpacity>


          {/* copy token */}
          {copiedToken && <View>
            <Text style={{
              fontWeight: 'bold',
              color: '#fff',
              fontFamily: 'Nunito-Medium',
              fontSize: 15,
              textAlign: "center",
              marginBottom: 8
            }}>{copiedToken}</Text>
          </View>}
          {/* {  tokenStatue && <View>
            <Text  style={{
                fontWeight: 'bold',
                color: '#fff',
                fontFamily: 'Nunito-Medium',
                fontSize: 15,
                textAlign: "center",
                marginBottom: 8
              }}>{tokenStatue}</Text>
          </View>} */}





          {/* deposit exchange modal */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View>
              <FontAwesome5
                name="wallet"
                size={24}
                color="#3376bc"
                style={{ paddingRight: 10 }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#3376bc',
                  fontFamily: 'Nunito-Medium',
                  fontSize: 15,
                }}
              >
                Deposit from exchange
              </Text>
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Nunito-Regular',
                  fontSize: 15,
                }}
              >
                By direct transfer from your account
              </Text>
            </View>
          </View>


          {/* confirm deposit amount */}
          <Text style={{
            color: '#fff',
            fontFamily: 'Nunito-Regular',
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold', marginTop: 30
          }}>Enter token to verify deposit</Text>

          <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 10 }}>
            <TextInput editable={false} value={token} style={{ backgroundColor: "#fff", color: "#000" }} placeholder="copy/paste token to confirm deposit" />
            <TouchableOpacity  >
              <Button onPress={verfyDeposit} title="Verify deposit" />
            </TouchableOpacity>
          </View>
          {vericationStatue && <View>
            <Text style={{
              fontWeight: 'bold',
              color: '#fff',
              fontFamily: 'Nunito-Medium',
              fontSize: 15,
              textAlign: "center",
              marginBottom: 8
            }}>{vericationStatue}</Text>
          </View>}

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DepositScreen
