import { doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, Pressable, Alert } from 'react-native'
import { auth, db } from '../firebase/firebaseConfig'
import { uuidv4 } from '@firebase/util';

const WithdrawScreen = ({ navigation, route }) => {
  const [Address, setAddress] = useState('')
  const [Amount, setAmount] = useState('')
  const [addressError, setAddressError] = useState(false)
  const [amountError, setAmountError] = useState(false)
  const [amountError2, setAmountError2] = useState(false)

  const [transaction, setTransction] = React.useState([])

  const [isSending, setIsendending] = React.useState(false)



  useEffect(() => {
    const refDoc = doc(db, "users", auth.currentUser.uid)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const { transactions } = snapshot?.data()
        setTransction(transactions)

      }
    })
    return () => unsub()

  }, [])


  const handleAlert = async () => {

    if (Address.length === 0) {
      setAddressError(true)
      return
    }
    if (Amount.length === 0) {
      setAmountError(true)
      return
    }

    if ((typeof (+Amount)) !== "number") {
      setAmountError2(true)
      return
    }



    if (+Amount > +route.params?.amount || +route.params?.amount === 0) {

      Alert.alert("Insufficient Balance", "You don`t have enough balance to proceed with the transaction", [
        {
          text: "cancel",

        },
        {
          text: "ok",

        }
      ])
      return

    }




    if (!addressError && !amountError) {
      setIsendending(true)

      // console.log("In process",route.params?.amount, Amount);
      try {
        const userRef = doc(db, "users", auth.currentUser.uid)


        const timeNow = Timestamp.now()

        await updateDoc(userRef, {
          Withdraw: {
            amount: Amount,
            status: true,
            type: "withdraw",
            Address

          },
          transactions: [...transaction, { type: "Withdraw", amount: Amount, status: false, name: route.params?.id, time: timeNow, id: uuidv4(), Address }]


        })




      } catch (error) {

        Alert.alert("Withdrawal status", "failed to verify token try again", [
          {
            text: "cancel",
            // onPress: () => setToken(""),
          },
          {
            text: "ok",
            // onPress: () => setToken(""),
          }
        ])

      }

      Alert.alert(`Sending ${route.params?.id}`, 'Withdrawal in proceess.... ', [
        {
          text: 'Goto wallet',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setIsendending(false)
          }

        },
        {
          text: 'OK',
          onPress: () => {
            setAddress("")
            setAmount("")
            setIsendending(false)
          }

        },

      ]);
    }

  }


  const onInputChange = (text) => {
    setAddressError(false)
    setAddress(text)
    setIsendending(false)
  }

  const onAmountChange = (text) => {
    setAmountError(false)
    setAmount(text)
    setIsendending(false)

  }

  // console.log(route.params.amount);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <View style={{ flex: 2 }}>
        <View
          style={{
            margin: 10,
            backgroundColor: '#3376bc',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Nunito-Regular',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Address :{' '}
            </Text>
            <TextInput
              placeholder={`enter  ${route.params?.id} address`}
              multiline={true}
              onChangeText={(text) => onInputChange(text)}
              value={Address}
              style={{
                padding: 3,
                borderBottomWidth: 0,
                width: '70%',
                backgroundColor: '#fff',

              }}
            />
          </View>
          {addressError && <Text style={{ textAlign: "center", marginBottom: 5, color: "red" }}>Address require</Text>}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 7
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Nunito-Regular',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              {route.params?.id} Amount :{' '}
            </Text>
            <TextInput
              inputMode="decimal"
              keyboardType='decimal-pad'
              placeholder={`enter price`}
              multiline={true}
              maxLength={70}
              onChangeText={(text) => onAmountChange(text)}
              value={Amount}
              style={{
                padding: 3,
                borderWidth: 0,
                width: '70%',
                backgroundColor: '#fff',
              }}
            />
          </View>
          {amountError && <Text style={{ textAlign: "center", marginBottom: 5, color: "red" }}>Amount require</Text>}
          {amountError2 && <Text style={{ textAlign: "center", marginBottom: 5, color: "red" }}>Amount must be  number</Text>}

        </View>
        <Text style={{ textAlign: "right" }}>{`Available balance $${route.params?.amount} `}</Text>
      </View>
      <View>
        <Pressable
          onPress={handleAlert}
          disabled={isSending}
          style={{ backgroundColor: '#3376bc', borderRadius: 8, padding: 15 }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              fontFamily: 'Nunito-Regular',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Next
          </Text>
        </Pressable>

      </View>
    </View>
  )
}

export default WithdrawScreen
