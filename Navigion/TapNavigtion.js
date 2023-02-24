import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CryptoList, DepositScreen, Home, SettingScreen as Discover, WithdrawScreen } from '../sreens';
import { FontAwesome , Fontisto, AntDesign} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()


const StackComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}  
        options={{headerShown: false}} 
      />
      <Stack.Screen
        name="Deposit"
        component={DepositScreen}
        options={({route}) => ({
          title: `Deposit ${route.params?.title}`
        })}
      />
       <Stack.Screen
        name="Withdrawal"
        component={WithdrawScreen}
        options={({route}) => ({
          title: `Withdraw ${route.params?.title}`
        })}
      />
      <Stack.Screen
        name="Discover"
        component={CryptoList}
      />
    </Stack.Navigator>
  )
}

const TapNavigtion = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {paddingVertical: 7, height: 60},
      tabBarLabelStyle: {fontSize: 15},
      tabBarActiveTintColor: "#3376bc"
    }}>
      <Tab.Screen name="Main" component={StackComponent} options={{
        headerShown: false,
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Discover1" component={CryptoList} options={{
     
          tabBarLabel: 'Favourite',
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="favorite" size={size} color={color} />
          ),
          tabBarBadge: 5,
          tabBarBadgeStyle: {color: "white", backgroundColor: "#3376bc"},
          headerTitle: "Discover Asset",
          headerTitleAlign: "center",
          headerTitleStyle:  {
            fontSize: 30,
            color: "#3376bc",
            fontFamily: 'Nunito-Bold',
            fontWeight: "bold"
          },
        }}/>

        <Tab.Screen name="Markets" component={Discover} options={{
          // headerTitleAlign: "center",
          // headerTitleStyle:  {
          //   fontSize: 30,
          //   color: "#3376bc",
          //   fontFamily: 'Nunito-Bold',
          //   fontWeight: "bold",
          // },
          headerShown: false,
     
     tabBarLabel: 'Discover',
     tabBarIcon: ({ color, size }) => (
      <AntDesign name="find" size={size} color={color} />
      
     ),
   }}/>
    </Tab.Navigator>
  )
}

export default TapNavigtion