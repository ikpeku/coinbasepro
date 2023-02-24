// import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext } from 'react'
import { View, StyleSheet, Image, Pressable, Text} from 'react-native'
// import { auth, db } from '../firebase/firebaseConfig'
import { AuthContext } from '../context/AuthContext'

const LogoHeader = ({navigation}) => {
  const {user} = useContext(AuthContext)
 



 
  return (

      <View style={styles.logoContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.user}>
          <Image style={styles.notice} source={require('../assets/account_circle.png')} />
        </Pressable>
      </View>
  )
}

export default LogoHeader

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 20
  },
  notice: {
    width: 30,
    height: 30,
    // fontWeight: 'bold',
    tintColor: "#fff"
  },
  user: {
    backgroundColor: '#4b82bf',
    padding: 7,
    borderRadius: 100
  }
  
})
