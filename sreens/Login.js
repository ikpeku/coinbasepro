import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, } from '@expo/vector-icons';

import { SignWithEmail } from '../firebase/firebaseConfig';



const Login = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)



  const handleLogin = async () => {
    setIsLoading(true)
    if (!password && !email) return
    await SignWithEmail(email, password)
    // setIsLoading(false)

    // setIsLoading(false)
  }



  const [showPassword, setShowPassword] = useState(true)

  const handleNav = () => {
    navigation.navigate("Register")
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={'large'} color="#3376bc" />
      </View>
    )
  }



  return (
    <SafeAreaView style={styles.logincontainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>

          <View style={{ flex: 1, alignItems: "center", marginVertical: 30 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", fontFamily: "Nunito-Medium", color: "#3376bc" }}>Login</Text>
          </View>
          <View style={{ flex: 3, width: "100%", marginVertical: 50 }}>
            <View style={{ backgroundColor: "#3376bc", padding: 20, marginHorizontal: 20, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Email</Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, marginBottom: 10 }}>
                <TextInput placeholder="example.com" style={{ width: "100%", padding: 4 }} autoCorrect inputMode="email" keyboardType="email-address" value={email} onChangeText={(text) => setEmail(text)} />
              </View>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Password</Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, flexDirection: "row", alignItems: "center" }}>
                <TextInput placeholder="*********" style={{ width: "85%", padding: 4 }} secureTextEntry={showPassword} value={password} onChangeText={(text) => setPassword(text)} />
                <FontAwesome name="eye" size={24} color="#3376bc" onPress={() => setShowPassword((pass) => !pass)} />
              </View>

              <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => navigation.navigate("Reset")}>
                <Text style={{ textAlign: "right", color: "#fff", fontSize: 15, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={{ marginVertical: 5, padding: 10, backgroundColor: "#fff", borderRadius: 5 }} onPress={handleLogin}>
                <Text style={{ textAlign: "center", color: "#3376bc", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Medium", }}>Log In</Text>
              </TouchableOpacity>

            </View>
          </View>


          <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", width: "100%", marginTop: 40 }}>
            <Text style={{ fontSize: 15, fontFamily: "Nunito-Regular", }}>Don't have an account? </Text>
            <TouchableOpacity activeOpacity={0.6} onPress={handleNav}>
              <Text style={{ fontSize: 15, fontFamily: "Nunito-Regular", color: "#3376bc", fontWeight: "bold" }}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView >
    </SafeAreaView >
  )
}

export default Login


const styles = StyleSheet.create({
  logincontainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 10
  },
})
