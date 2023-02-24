import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Balance from './Balance'
import LogoHeader from './LogoHeader'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

const Header = ({ navigation }) => {


    const [Name, setFullName] = useState("")
    const [address, setAddress] = useState("")
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")



  useEffect(() => {


    const refDoc = doc(db, "users", auth.currentUser?.uid)
  
      const unsub = onSnapshot(refDoc, (snapshot) => {
        if(snapshot.exists()){
          const {name, address, title, amount} = snapshot?.data()?.selectedCoin
          setFullName(name)
          setAddress(address)
          setTitle(title)
          setAmount(amount)
         
          
        }
      })
  
      return () => unsub()
  }, [])

  // console.log("nAme", Name, address);

 
  return (
    <View style={styles.headerContainer}>
      <LogoHeader navigation={navigation} />
      <Balance />
      <View style={styles.buttonContainer}>

        <View style={styles.btn}>
          <Pressable>
            <Text onPress={() => navigation.navigate("Deposit", {id: Name, address: address, title:title})} style={styles.button}>
              Deposit
            </Text>
          </Pressable>
        </View>

        <View style={styles.btn}>
          <Pressable onPress={() => navigation.navigate("Withdrawal", {id: Name, address: address, title: title, amount: amount})}>
            <Text style={styles.button}>Withdraw</Text>
          </Pressable>
        </View>

      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: '#3376bc',
    paddingTop: 25
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginTop: 35
  },

  buttonContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: "end"
    marginTop: 5,
  },
  button: {
    color: '#fff',
    padding: 10,
    fontWeight: 'bold',
    borderRadius: 10,
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
  },

  btn: {
    backgroundColor: '#4b82bf',
    marginHorizontal: 10,
    marginVertical: 3,
    width: '40%',
  },
})
