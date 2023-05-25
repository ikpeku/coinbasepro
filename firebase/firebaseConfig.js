import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, serverTimestamp, doc } from "firebase/firestore"
import { Alert } from "react-native"



const firebaseConfig = {
    apiKey: "AIzaSyA0vO-Z__DbC96E4XC7sYMOObY_XMOlw9Q",
    authDomain: "coinbasepro-e4641.firebaseapp.com",
    projectId: "coinbasepro-e4641",
    storageBucket: "coinbasepro-e4641.appspot.com",
    messagingSenderId: "763888052555",
    appId: "1:763888052555:web:c4d2bb3055eae7e07b20ce"
};



export const app = initializeApp(firebaseConfig);
export const db = getFirestore()

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, updateProfile } from "firebase/auth"



export const auth = getAuth(app)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
    prompt: "select_account"
})



export const googleLogin = () => signInWithPopup(auth, provider)





export const SignnedOut = async () => await signOut(auth)


export const CreateWithEmail = async (email, password, fullName, date) => {
    if (!password && !email && !fullName && !date) return
    // const {dispatch} = useContext(AuthContext)
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        // dispatch({type: "ISLOADING"})
        // await sendEmailVerification(auth.currentUser)
        await updateProfile(auth.currentUser, { displayName: fullName })
        // dispatch({type: "ISNOTLOADING"})


        const data = {
            Register: serverTimestamp(),
            Name: fullName,
            Email: email,
            DOB: date,
            phoneNumber: "",
            licence: "",
            licenceBack: "",
            passport: "",
            verifyUser: false,
            bankName: "",
            accountNumber: "",
            accountName: "",
            swiftCode: "",
            token: {
                BTC: 0, ETH: 0, USDT: 0, LTC: 0, BNB: 0
            },
            selectedCoin: {
                name: "BTC",
                amount: 0,
                title: 'Bitcoin',
                address: "1GKpL6QtazVRdBTPeqeFqpZYif6a6Jfsku"
            },
            Deposit: {
                amount: "",
                status: false,
                type: ""
            },
            Withdraw: {
                amount: "",
                status: false,
                type: ""
            },
            transactions: []
        }



        await setDoc(doc(db, "users", user.uid), data)
        // await setDoc(doc(db, "transactions", user.uid ), transaction)


    } catch (error) {
        // console.log(error.message)
        switch (error.code) {
            case "auth/invalid-email":
                Alert.alert("Invalid email", "Email provided is invalid", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return
            case "auth/weak-password":
                Alert.alert("Password", "password should be less than 6 characters", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return
            case "auth/email-already-in-use":
            case "auth/email-already-exists":
                Alert.alert('Email not verify', "The provided email is already in use by an existing user. ", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return
            case "auth/internal-error":
                Alert.alert("ooooh! operation fail", "can not register user at the moment please try again", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return
            case "auth/invalid-display-name":
                Alert.alert("The provided value for the displayName is invalid. It must not be empty.")
                return

            case "auth/invalid-email":
                Alert.alert("The provided value for the email is invalid. ")
                return
            case "auth/network-request-failed":
                Alert.alert("Bad Network", "weak network please refresh.", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return
            case "auth/missing-email":
                Alert.alert("Email missing", "Please provide a valid email to continue.", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return

            default:
                break;
        }

    }
}




export const SignWithEmail = async (email, password) => {
    if (!password && !email) return
    try {
        await signInWithEmailAndPassword(auth, email, password)

    } catch (error) {
        //   console.log(error.message)
        switch (error.code) {
            case "auth/invalid-email":
                Alert.alert("Invalid email", "Email provided is invalid", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])


            case "auth/user-not-found":
                Alert.alert("User", "user credential is not registered.", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return


            case "auth/wrong-password":
                Alert.alert("Password", "user credential is wrong", [
                    {
                        text: "cancel",
                    },
                    {
                        text: "ok"
                    }
                ])
                return

            default:
                break;
        }

    }
}


