import React from 'react'
import { SafeAreaView, StyleSheet, TextInput, View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Crypto } from '../components'

const CryptoList = ({navigation, route}) => {
  const [text, setText] = React.useState('')

  // console.log("Deposit : ",route.params.deposit)

  return (
    <SafeAreaView style={styles.cryptoContainer}>
      <View style={styles.inputContainer}>
      <Ionicons name="search" size={20} color="#C6C6C6" />
        <TextInput
          style={styles.input}
          onChangeText={(e) => setText(e)}
          value={text}
          placeholder="Search"
        />
      </View>

      <View style={{ marginVertical: 10}}>
        {route.params?.deposit === undefined && <Text style={styles.title}>Choose Asset</Text>}
        {route.params?.deposit &&  <Text style={styles.title}>Choose Asset to buy</Text>}
        {route.params?.deposit === false && <Text style={styles.title}>Choose Asset to Withdraw</Text>}
      </View>
     
      <View>
        <Crypto textInput={text} navigation={navigation} discover={route.params?.deposit} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cryptoContainer: {
    paddingHorizontal: 10,
  },

  input: {
    width: "100%",
    paddingHorizontal: 4,
  
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginVertical: 10,
    borderColor: "#C6C6C6",
    borderRadius: 10

  }, 
  title: {
    fontFamily: "Nunito-Black",
    fontWeight: "bold",
    fontSize: 24,

    

  }
})

export default CryptoList
