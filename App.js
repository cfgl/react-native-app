import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Provider as PaperProvider } from 'react-native-paper'
import Nav_cfb from './src_cfb/navigators'

import DefaultTheme from './src/styles/DefaultTheme'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './src/redux/store'
import OneSignal from 'react-native-onesignal' // Import package from node modules
import { ONSIGNAL_KEY } from '@env'
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: "tomato",
    // accent: "yellow"
    //
  },
}

console.disableYellowBox = true
export default class Main extends React.Component {
  constructor(properties) {
    super(properties)
    //Remove this method to stop OneSignal Debugging
    OneSignal.setLogLevel(6, 0)

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init(ONSIGNAL_KEY, {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    })

    try {
      AsyncStorage.getItem('notification').then(value => {
        if (value !== null) {
          //alert(value)
          // We have data!!
          if (value === 'ok') {
            OneSignal.inFocusDisplaying(2)
          } else {
            OneSignal.inFocusDisplaying(0)
          }
        }
      })
    } catch (error) {
      // Error retrieving data
    }
    // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(this.myiOSPromptCallback)
    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('ids', this.onIds)
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived(notification) {
    console.log('Notification received: ', notification)
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
  }

  onIds = device => {
    console.log('Device info: ', device)
    this._storeData(device.pushToken, device.userId)
  }
  myiOSPromptCallback = permission => {
    // do something with permission value
  }

  notification_ = async () => {}

  _storeData = async (token, userId) => {
    try {
      await AsyncStorage.setItem('pushToken', token)
      await AsyncStorage.setItem('userId', userId)
    } catch (error) {
      // Error saving data
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if (value !== null) {
        // We have data!!
        //alert(value)
        console.log(value)
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PaperProvider theme={theme}>
            <Nav_cfb />
          </PaperProvider>
        </PersistGate>
      </Provider>
    )
  }
}

// export default function Main() {
//   return (
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <PaperProvider theme={theme}>
//           <Nav />
//         </PaperProvider>
//       </PersistGate>
//     </Provider>
//   );
// }
