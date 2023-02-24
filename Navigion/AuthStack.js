import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Login , Onbroading, RegisterScreen, ResetPasswordScreen} from '../sreens'


const Stack = createNativeStackNavigator()
const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Main" >
      <Stack.Screen
        name="Main"
        component={Onbroading} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}  
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}  
      />
      <Stack.Screen
        name="Reset"
        component={ResetPasswordScreen}
        options={{ headerTitle: "Reset Password" }} 
      />
    </Stack.Navigator>
  )
}

export default AuthStack
