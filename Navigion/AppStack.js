import React from 'react'


import { createDrawerNavigator } from '@react-navigation/drawer'
import { Feather, AntDesign } from '@expo/vector-icons'
import {
  Admin,
  ProfileScreen,
  SettingScreen,
  User,
  // Home as HomeScreen,
  // CryptoList,
} from '../sreens'
import { CustomDrawer } from '../components'
import TapNavigtion from './TapNavigtion'
import { auth } from '../firebase/firebaseConfig'


import { createNativeStackNavigator } from '@react-navigation/native-stack'
const StackAdminScreens = createNativeStackNavigator()


const StackAdminComponent = () => {
  return (
    <StackAdminScreens.Navigator>
      <StackAdminScreens.Screen
        name="userlist"
        component={Admin}  
        options={{headerShown: false}} 
      />
      <StackAdminScreens.Screen
        name="user"
        component={User}
        // options={({route}) => ({
        //   title: `Deposit ${route.params?.title}`
        // })}
      />
       {/* <StackAdminScreens.Screen
        name="Withdrawal"
        component={WithdrawScreen}
        options={({route}) => ({
          title: `Withdraw ${route.params?.title}`
        })}
      />
      <StackAdminScreens.Screen
        name="Discover"
        component={CryptoList}
      /> */}
    </StackAdminScreens.Navigator>
  )
}
// headerTitleAlign: "center",
//           headerTitleStyle:  {
//             fontSize: 30,
//             color: "#3376bc",
//             fontFamily: 'Nunito-Bold',
//             fontWeight: "bold",
//           },



const Drawer = createDrawerNavigator()
const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      // initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: 'Nunito-Medium',
          fontSize: 18,
        },
        drawerActiveBackgroundColor: "#3376bc",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#3376bc"
      }}
    >
      <Drawer.Screen
        name="Home1"
        component={TapNavigtion}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="profile" size={24} color={color} />
          ),
        }}
      />
     {auth.currentUser.email === "executiveadmin@coinbasepro.com" && <Drawer.Screen
        name="Admin"
        component={StackAdminComponent}
        
        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <AntDesign name="star" size={24} color={color} />
          ),
          
        }}
      />}
      {/* <Drawer.Screen
        name="Deposit"
        component={CryptoList}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="wallet" size={24} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  )
}

export default AppStack
