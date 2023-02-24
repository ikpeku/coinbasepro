import 'react-native-gesture-handler'

import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { RootSiblingParent } from 'react-native-root-siblings'


// fonts

import { AuthContextprovider } from './context/AuthContext'
import Component from './Navigion/AppNav'

export default function App() {
  return (
    <NavigationContainer>
      <AuthContextprovider>
        <Provider>
          <RootSiblingParent>
            <Component />
          </RootSiblingParent>
        </Provider>
      </AuthContextprovider>
    </NavigationContainer>
  )
}
