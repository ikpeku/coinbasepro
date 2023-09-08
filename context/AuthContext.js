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
        dispatch({ type: 'LOGIN' })
      } else {
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
