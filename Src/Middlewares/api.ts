import {normalize} from 'normalizr';
import axios, {AxiosRequestHeaders, AxiosResponse} from 'axios';
import qs from 'qs';
import Config from 'react-native-config';
import {
   Props,
   middlewareReturnProps,
   finalActionProps,
   nextActionParams,
   MiddlewareProps,
} from './types/api';

const defaultHeaders: AxiosRequestHeaders = {
   'Content-Type': 'application/json',
};

const BASE_URL = Config.MOBILE_API_ROOT;

export const callApi = async ({
   endpoint,
   schema,
   method,
   headers = {},
   body,
   params = {},
   config = {},
   path,
   userToken,
   externalCall,
}: Props): Promise<middlewareReturnProps> => {
   const options = {
      baseURL: externalCall ? '' : BASE_URL,
      headers: {
         ...defaultHeaders,
         ...headers,
         ...(userToken ? {Authorization: `Bearer ${userToken}`} : {}),
      },
   };

   const axiosInstance: Record<string, any> = axios.create(options);

   let query = '';

   if (body) {
      Object.keys(body).forEach((key) => {
         if (body[key] === undefined) delete body[key];
      });
   }
   let configParams = [{...config}];

   if (path) {
      query += '/' + path.join('/');
   }

   if (params) {
      query += qs.stringify(params, {addQueryPrefix: true});
   }

   if (['post', 'patch', 'put', 'delete'].includes(method)) {
      configParams = [body, {...params, ...config}];
   }

   try {
      const axiosSuccessReponseTypes = [200, 201, 202, 203, 204, 205, 206];

      const response: AxiosResponse = await axiosInstance[method](
         `${externalCall ? '' : BASE_URL}${endpoint}${query}`,
         ...configParams,
      );

      const json = response.data;

      if (axiosSuccessReponseTypes.includes(response.status)) {
         if (response.data) {
            return {response: schema ? {...normalize(json, schema)} : json};
         } else {
            return {
               response: {
                  ...response,
               },
            };
         }
      } else {
         return {
            responseError: {
               message: response.statusText,
               status: response.status,
            },
         };
      }

      // return {
      //    response: schema ? { ...normalize(json, schema) } : json,
      // };
   } catch (err) {
      return {
         responseError: {message: err.message},
      };
   }
};
export const CALL_API: any = Symbol('Call API');

export default ({getState, dispatch}: finalActionProps): any =>
   (next: (action: Record<string, any>) => boolean): any =>
   async (action: Record<string, any>): Promise<boolean> => {
      const callAPI = action[CALL_API];
      if (typeof callAPI === 'undefined') {
         return next(action);
      }

      const {endpoint} = callAPI;
      const {
         schema,
         types = {
            request: '',
            success: '',
            failure: '',
         },
         body,
         params,
         path,
         headers,
         meta,
         cache,
         withQuery,
         withoutParams,
         additionalData,
         refresh = false,
         token,
         config,
         externalCall,
      }: MiddlewareProps = callAPI;
      const method = callAPI.method || 'get';

      const userToken =
         getState()?.auth?.loginSuccessData.access_token || token;

      if (!Object.values(types).every((t) => typeof t === 'string')) {
         throw new Error('Expected action types to be strings.');
      }

      function actionWith(data: nextActionParams): Record<string, any> {
         const finalAction = Object.assign({}, action, data);
         delete finalAction[CALL_API];
         return finalAction;
      }

      const {request, success, failure} = types;

      if (!refresh) {
         let cachedData = null;
         if (cache && cache.store && cache.key) {
            const reducerState = getState()[cache.store];
            if (reducerState) {
               cachedData = cache.key
                  .split('.')
                  .reduce((p, c) => (p && p[c]) || null, reducerState);
            }
         }

         if (
            (Array.isArray(cachedData) && cachedData.length > 0) ||
            (!Array.isArray(cachedData) && cachedData !== null)
         ) {
            const cachadParams: Record<string, any> = {
               data: cachedData,
            };
            Array.isArray(cachedData) &&
               (cachadParams.length = cachedData.length);

            meta &&
               meta.onSuccess &&
               meta.onSuccess(
                  {code: '200', entity: null, cachadParams},
                  dispatch,
               );
            if (meta && meta.callback) {
               meta.callback(dispatch);
            }
            return true;
         }
      }

      request && next(actionWith({type: request, additionalData}));

      if (!endpoint || typeof endpoint !== 'string') {
         meta &&
            meta.onSuccess &&
            meta.onSuccess({code: '200', entity: null}, dispatch);
         if (meta && meta.callback) {
            meta.callback(dispatch);
         }
         return true;
      }

      try {
         const {response, responseError} = await callApi({
            endpoint,
            schema,
            method,
            headers,
            body,
            params,
            path,
            userToken,
            withQuery,
            withoutParams,
            config,
            externalCall,
         });

         if (response || (response === '' && externalCall)) {
            // ############## SUCCESS ############## //
            meta &&
               meta.onBeforeSuccess &&
               meta.onBeforeSuccess({payload: response}, dispatch);
            success &&
               next(
                  actionWith({
                     type: success,
                     payload: response,
                     additionalData,
                  }),
               );
            meta &&
               meta.onSuccess &&
               meta.onSuccess({payload: response}, dispatch);
            // ############## ::/SUCCESS ############## //
         } else if (responseError) {
            // ############## FAILURE ############## //
            failure &&
               next(
                  actionWith({
                     type: failure,
                     error: responseError || {message: 'Something went wrong'},
                     additionalData,
                  }),
               );

            meta && meta.onFailure && meta.onFailure(responseError, dispatch);

            // ############## ::/FAILURE ############## //
         }
      } catch (error) {
         // ############## FAILURE ############## //
         failure &&
            next(
               actionWith({
                  type: failure,
                  error: {message: error.message},
                  additionalData,
               }),
            );
         meta &&
            meta.onFailure &&
            meta.onFailure(
               {
                  message: error.message,
               },
               dispatch,
            );

         // ############## ::/FAILURE ############## //
      }

      if (meta && meta.callback) {
         meta.callback(dispatch);
      }

      return true;
   };
