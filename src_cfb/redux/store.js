import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import createSensitiveStorage from 'redux-persist-sensitive-storage'
import thunk from 'redux-thunk'

const storage = createSensitiveStorage({
  keychainService: 'myKeychain',
  sharedPreferencesName: 'mySharedPrefs',
})

const config = {
  key: 'root',
  storage,
}

import user from './reducers/user'
import otherUser from './reducers/otherUser'
import game from './reducers/game'
const rootReducer = persistCombineReducers(config, {
  // user: user,
  otherUser: otherUser,
  game: game,
})
//const rootReducer = combineReducers();

export let store = createStore(rootReducer, applyMiddleware(thunk))
export let persistor = persistStore(store)
