import {AccountActionTypes} from '../types';
import {PayloadAction} from '@reduxjs/toolkit';
import {initialStateProps} from '../models/account';

const initialState: initialStateProps = {
   isLoggedIn: false,
   isLoading: false,
   isError: false,
};

export default (
   state = initialState,
   action: PayloadAction<any>,
): initialStateProps => {
   switch (action.type) {
      case AccountActionTypes.LOGIN_REQUEST:
         return {
            ...state,
            isLoading: false,
            isError: true,
         };
      case AccountActionTypes.LOGIN_REQUEST:
         return {
            ...state,
            isLoading: false,
            isError: true,
         };
      case AccountActionTypes.LOGIN_REQUEST:
         return {
            ...state,
            isLoading: false,
            isError: true,
         };
      default:
         return state;
   }
};
