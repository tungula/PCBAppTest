import {createStore, combineReducers, applyMiddleware} from 'redux';
import apiMiddleware from '../Middlewares/api';
import ReduxThunk from 'redux-thunk';
import {persistStore, persistReducer, Storage} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension';
import {RootStateOrAny} from 'react-redux';

import accountReducer from './reducers/account';

import createFilter, {
   createBlacklistFilter,
} from 'redux-persist-transform-filter';

const loginSlice = createFilter('root', [
   'account.personal_details',
]);

const exclude = createBlacklistFilter('root', ['auth.userExists']);

const persistConfig: {
   key: string;
   storage: Storage;
   whitelist: string[];
   transforms?: Array<any>;
} = {
   key: 'root',
   storage: AsyncStorage,
   whitelist: ['auth'], // include persist reducers here
   transforms: [loginSlice, exclude],
};

const appReducer = combineReducers({
   account: accountReducer,
});

const rootReducer = (state: RootStateOrAny, action: any) => {
   return appReducer(state, action);
};

const pReducer = persistReducer(persistConfig, rootReducer);

const middleware = applyMiddleware(ReduxThunk, apiMiddleware);

const store = createStore(pReducer, composeWithDevTools(middleware));

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store, persistor};
