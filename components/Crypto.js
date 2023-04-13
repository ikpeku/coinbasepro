import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import { images } from '../constant/CoinIcon'
import { auth, db } from '../firebase/firebaseConfig'


const {
  BTC,
  ETH,
  BNB,
  USDT,
  LTC,
} = images




const Item = ({ item, onPress, backgroundColor, textColor, imgUrl }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor, borderRadius: 20, }]}
  >
    <View style={{ flexDirection: 'row', alignItems: "center", borderRadius: 10 }}>
      <View>
        <Image
          style={styles.coinlogo}
          source={{
            uri: imgUrl,
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "85%" }}>
        <Text style={[styles.title, { color: textColor, fontSize: 18, fontFamily: "Nunito-Black" }]}>{item.title}</Text>
        <Text
          style={[styles.title, { color: textColor, fontSize: 18, fontFamily: "Nunito-Black" }]}
        >{`${item.amt} ${item.id} `}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

const Crypto = ({ textInput, navigation, discover }) => {
  const [selectedId, setSelectedId] = useState()
  const [token, setToken] = useState(null)


  const DATA = [
    {
      id: 'BTC',
      title: 'Bitcoin',
      amt: token?.BTC,
      img: BTC,
      address: "1GKpL6QtazVRdBTPeqeFqpZYif6a6Jfsku"
    },
    {
      id: 'ETH',
      title: 'Ethereum',
      amt: token?.ETH,
      img: ETH,
      address: "0x977be2b4dd4216fa4386a5d594676f3f5ba8b9d9"
    },
    {
      id: 'LTC',
      title: 'Litecoin',
      amt: token?.LTC,
      img: LTC,
      address: "LWPGCyu2oc7VV33X3zmth7XfNyzqk4dTBN"
    },

    {
      id: 'BNB',
      title: 'BNB Smart Chain',
      amt: token?.BNB,
      img: BNB,
      address: "LWPGCyu2oc7VV33X3zmth7XfNyzqk4dTBN"
    },
    {
      id: 'USDT',
      title: 'Tether',
      amt: token?.USDT,
      img: USDT,
      address: "0x977be2b4dd4216fa4386a5d594676f3f5ba8b9d9"
    },

  ]




  const DataFilter = DATA.filter(data => {
    if (textInput) {
      const res = data.title.includes(textInput)
      return res
    } else {
      return true
    }

  })


  const renderItem = ({ item }) => {
    const backgroundColor = item.id !== selectedId ? '#3376bc' : '#3376bc'
    const color = item.id !== selectedId ? 'white' : 'black'

    const handleSelected = async () => {
      setSelectedId(item.id)

      if (discover === undefined) {


        try {
          const userRef = doc(db, "users", auth.currentUser.uid)
          navigation.navigate("Home")
          await updateDoc(userRef, {
            selectedCoin: {
              amount: item.amt,
              name: item.id,
              address: item.address,
              title: item.title

            }
          })

        } catch (error) {
          console.log(error)

        }

        return
      }

      // if(discover){
      //   navigation.navigate("Deposit", {id: item.id, address: item.address, title: item.title})
      //   return
      // } 

      // if(!discover){
      //   navigation.navigate("Withdrawal", {id: item.id, address: item.address, title: item.title, amount: item.amt})
      //   return
      // } 

    }

    return (
      <Item
        item={item}
        onPress={handleSelected}
        backgroundColor={backgroundColor}
        textColor={color}
        imgUrl={item.img}
      />
    )
  }

  // connect to db



  useEffect(() => {


    const refDoc = doc(db, "users", auth.currentUser.uid)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const { token } = snapshot.data()
        setToken(token)




      }
    })

    return () => unsub()
  }, [])




  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DataFilter}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 5,
  },
  item: {
    paddingHorizontal: 4,
    marginVertical: 8,
    paddingVertical: 4,

  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito-Black',
  },
  coinlogo: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
  },
})

export default Crypto
