import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useEffect, useReducer } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

export const AuthContext = createContext()

export const AuthContextprovider = ({ children }) => {
  const userReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
      case 'REGISTER':
        return { ...state, user: action.payload }

      case 'LOGOUT':
        return { user: null }

      case 'ISLOADING':
        return { ...state, isLoading: true }
      case 'ISNOTLOADING':
        return { ...state, isLoading: false }
      case 'ISUSERTOKEN':
        return { ...state, userToken: action.payload }

      default:
        return state
    }
  }

  const initialData = {
    user: null,
    isLoading: false,
    isError: null,
    isLoggedin: false,
    userToken: null,
  }

  const [state, dispatch] = useReducer(userReducer, initialData)

  useEffect(() => {
    const unSubquire = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'ISLOADING' })

        // save user to the storage
        const setObjectValue = async (value) => {
          try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('user', jsonValue)
          } catch (e) {
            // save error
          }

          // console.log('Done.')
        }
        setObjectValue(user)

        // store single data for token
        const uid = user.uid
        const storeData = async (value) => {
          try {
            await AsyncStorage.setItem('@storage_Key', value)
          } catch (e) {
            // saving error
          }
        }
        storeData(uid)


        //get store single data for token

        const getData = async () => {
          try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
              dispatch({ type: 'ISUSERTOKEN', payload: value })
            }
          } catch (e) {
            // error reading value
          }
        }

        getData()

        // get user info
        const getMyObject = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('user')
            if (jsonValue != null) {
              const data = JSON.parse(jsonValue)
              dispatch({ type: 'LOGIN', payload: data })
            }
          } catch (e) {
            // read error
          }

          // console.log('Done.')
        }

        getMyObject()

        dispatch({ type: 'ISNOTLOADING' })
      } else {
        // User is signed out
        const removeValue = async () => {
          try {
            await AsyncStorage.removeItem('@storage_Key')
            //   await AsyncStorage.removeItem('@storage_user')
          } catch (e) {
            // remove error
          }
        }

        removeValue()
        //    const clearAll = async () => {
        //         try {
        //           await AsyncStorage.clear()
        //         } catch(e) {
        //           // clear error
        //         }

        //         console.log('Done.')
        //       }

        //       clearAll()
        dispatch({ type: 'LOGOUT' })
      }

      return unSubquire()
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
