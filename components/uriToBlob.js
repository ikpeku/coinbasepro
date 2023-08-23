export const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response)
        }
        xhr.onerror = function () {
            reject(new Error('uriToBlob failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)

        xhr.send(null)
    })
}






// package files
// {
//   "name": "coinbasepro",
//   "version": "1.0.0",
//   "main": "node_modules/expo/AppEntry.js",
//   "scripts": {
//     "start": "expo start",
//     "android": "expo start --android",
//     "ios": "expo start --ios",
//     "web": "expo start --web"
//   },
//   "dependencies": {
//     "@gorhom/bottom-sheet": "^4.4.5",
//     "@react-native-async-storage/async-storage": "~1.17.3",
//     "@react-native-community/datetimepicker": "6.5.2",
//     "@react-navigation/bottom-tabs": "^6.5.4",
//     "@react-navigation/drawer": "^6.5.8",
//     "@react-navigation/native": "^6.1.3",
//     "@react-navigation/native-stack": "^6.9.9",
//     "@shopify/flash-list": "1.3.1",
//     "axios": "^1.3.3",
//     "expo": "~47.0.12",
//     "expo-clipboard": "~4.0.1",
//     "expo-font": "~11.0.1",
//     "expo-image-picker": "~14.0.2",
//     "expo-mail-composer": "~12.0.0",
//     "expo-splash-screen": "~0.17.5",
//     "expo-status-bar": "~1.4.2",
//     "expo-updates": "~0.15.6",
//     "firebase": "^9.17.1",
//     "moment": "^2.29.4",
//     "react": "18.1.0",
//     "react-native": "0.70.8",
//     "react-native-gesture-handler": "~2.8.0",
//     "react-native-paper": "^5.2.0",
//     "react-native-qrcode-svg": "^6.2.0",
//     "react-native-reanimated": "~2.12.0",
//     "react-native-root-toast": "^3.4.1",
//     "react-native-safe-area-context": "4.4.1",
//     "react-native-screens": "~3.18.0",
//     "react-native-svg": "13.4.0",
//     "whatwg-fetch": "3.6.2"
//   },
//   "resolutions": {
//     "react-native-svg": "12.3.0"
//   },
//   "devDependencies": {
//     "@babel/core": "^7.12.9"
//   },
//   "private": true
// }