import {CALL_API} from '../../Middlewares/api';
import {apiMiddlewareArgs} from '../../Middlewares/types/api';
import {AccountActionTypes} from '../types';

export const userLogin = ({
   onSuccess,
   onFailure,
   callback,
   ...rest
}: apiMiddlewareArgs) => ({
   [CALL_API]: {
      types: {
         request: AccountActionTypes.LOGIN_REQUEST,
         success: AccountActionTypes.LOGIN_SUCCESS,
         failure: AccountActionTypes.LOGIN_FAILURE,
      },
      method: 'post',
      meta: {onSuccess, onFailure, callback},
      ...rest,
   },
});
