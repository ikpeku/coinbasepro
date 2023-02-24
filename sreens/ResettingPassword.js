import React, { useState } from 'react';
import {View, Text, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';



const ResetPasswordScreen = () => {
    const [email, setEmail] = useState("")

    const handlePasswordReset = async() => {
        try {
            await sendPasswordResetEmail(auth, email)
            
        } catch (error) {
            
        }
    }


return(
  <SafeAreaView style={{flex: 1, padding: 20}}>

    <View style={{flexDirection: "row", alignItems: "center", padding: 10 ,backgroundColor: "#fff", borderRadius: 10}}>

    <MaterialIcons name="email" size={24} color="#3376bc" />
        <TextInput value={email} style={{flex:1, color: "#000", paddingLeft: 10}} onChangeText={(text) => setEmail(text)} />
    </View>

    <TouchableOpacity style={{backgroundColor: "#3376bc" , padding: 10, marginTop: 20}} onPress={handlePasswordReset}>
        <Text style={{fontWeight: "bold", fontSize: 22, textAlign: "center", fontFamily: "Nunito-Bold", color: "#fff"}}>Send Reset Link</Text>
    </TouchableOpacity>

     
  </SafeAreaView>
)
}

export default ResetPasswordScreen