import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, FontAwesome5, Entypo, AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateWithEmail } from '../firebase/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [newdate, setDate] = useState("2015/01/01");
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {

    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);

  };

  const showDatepicker = () => {
    // setShow(true)

    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  // Navigate
  const handleNav = () => {
    navigation.goBack()
  }

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleRegisterUser = async () => {
    setIsLoading(true)
    let currentDate = new Date()
    if (newdate === currentDate.toLocaleDateString()) {
      Alert.alert("Date of birth is too low")
      // return
    }
    if (!password && !email && !fullName && !newdate) {
      Alert.alert("ALl field required")
    }

    const date = Timestamp.fromDate(new Date(newdate))

    await CreateWithEmail(email, password, fullName, date)
    setIsLoading(false)
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

        <View style={{ flex: 1, }}>


          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%", marginVertical: 20 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", fontFamily: "Nunito-Medium", color: "#3376bc", textAlign: "center" }}>Create New Account</Text>
          </View>


          <View style={{ flex: 1, width: "100%" }}>

            <View style={{ backgroundColor: "#3376bc", padding: 20, marginHorizontal: 20, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Full Name</Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
                <TextInput placeholder="John Doe" style={{ width: "100%", padding: 4 }} autoCorrect inputMode="text" value={fullName} onChangeText={(text) => setFullName(text)} />
              </View>

              {/* Email start */}
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Email</Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, marginBottom: 10 }}>
                <TextInput placeholder="example.com" style={{ width: "100%", padding: 4 }} autoCorrect inputMode="email" keyboardType="email-address" value={email} onChangeText={(text) => setEmail(text)} />
              </View>

              {/* Password start */}
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Password</Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <TextInput placeholder="*********" style={{ width: "85%", padding: 4 }} secureTextEntry={showPassword} value={password} onChangeText={(text) => setPassword(text)} />
                <FontAwesome name="eye" size={24} color="#3376bc" onPress={() => setShowPassword((pass) => !pass)} />
              </View>

              {/* Date of birth */}
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Regular", }}>Date of birth</Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, marginBottom: 30, padding: 6, flexDirection: "row", alignItems: "center" }}>
                {/* <TextInput placeholder="D.O.B." style={{width: "100%",  padding: 4}} autoCorrect inputMode="text" /> */}

                <TouchableOpacity activeOpacity={0.6} style={{ marginLeft: 5, width: "85%", }} onPress={showDatepicker}>
                  <Text style={{ color: "#000", fontSize: 15, fontWeight: "bold", fontFamily: "Nunito-Medium", }}>{newdate.toLocaleString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={showDatepicker}>
                  <AntDesign name="calendar" size={24} color="#3376bc" />
                </TouchableOpacity>
                <View>

                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={new Date()}
                      mode={mode}
                      dateFormat="dayofweek day month"
                      dayOfWeekFormat={'{dayofweek.abbreviated(2)}'}
                      is24Hour={true}
                      onChange={onChange}
                      maximumDate={new Date(2005, 12, 31)}
                    />
                  )}

                </View>
                {/* <DatePicker /> */}
              </View>


              <TouchableOpacity activeOpacity={0.6} style={{ marginVertical: 5, padding: 10, backgroundColor: "#fff", borderRadius: 5 }} onPress={handleRegisterUser}>
                <Text style={{ textAlign: "center", color: "#3376bc", fontSize: 20, fontWeight: "bold", fontFamily: "Nunito-Medium", }}>Create Account</Text>
              </TouchableOpacity>

              {/* <View style={{marginVertical: 25, padding: 10, backgroundColor: "#fff", borderRadius: 5}}>
            <Text style={{textAlign: "center", color: "#3376bc", fontSize: 15, fontWeight: "bold", fontFamily: "Nunito-Medium",}}>Or Register With</Text>
            <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "center",}}>
            <FontAwesome5 name="google-plus" size={30} color="#3376bc" />
            <FontAwesome5 name="facebook" size={30} color="#3376bc" style={{marginHorizontal: 10, }} />
            <Entypo name="twitter-with-circle" size={30} color="#3376bc" />
            </View>
          </View> */}

            </View>
          </View>


          <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", width: "100%", marginTop: 30 }}>
            <Text style={{ fontSize: 15, fontFamily: "Nunito-Regular", }}>Already have an account? </Text>
            <TouchableOpacity activeOpacity={0.6} onPress={handleNav}>
              <Text style={{ fontSize: 15, fontFamily: "Nunito-Regular", color: "#3376bc", fontWeight: "bold" }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>



      </ScrollView>
    </SafeAreaView >
  )
}

export default RegisterScreen


const styles = StyleSheet.create({
  logincontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
