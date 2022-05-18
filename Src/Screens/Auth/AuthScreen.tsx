import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';

import {AuthContainer} from '../../Containers/Auth/AuthContainer';
import {RootStackGenericProp} from '../../Navigation/types';
import {useCustomDispatch} from '../../CustomHooks/useAppDispatch.hook';
import {userLogin} from '../../Store/actions/account';

interface Props {}

export const AuthScreen: React.FC<Props> = ({}) => {
   const dispatch = useCustomDispatch();
   const {push} = useNavigation<RootStackGenericProp<'MainStack'>>();

   const [visible, setVisible] = useState<boolean>(true);

   const onSwipeUp = () => {
      setVisible(true);
   };
   const onSwipeDown = () => {
      setVisible(false);
   };

   const onSubmit = () => {
      setVisible(false);
      push('MainStack');
   };

   // Action

   const login = (email: string, password: string) => {
      dispatch(
         userLogin({
            body: {
               email: email,
               password: password,
            },
            onSuccess: (response) => {
               console.log(response);
            },
            onFailure: () => {},
         }),
      );
   };

   return (
      <SafeAreaView
         style={{
            flex: 1,
            backgroundColor: 'green',
         }}>
         <AuthContainer
            visible={visible}
            onSwipeUp={onSwipeUp}
            onSwipeDown={onSwipeDown}
            onSubmit={onSubmit}
            login={login}
         />
      </SafeAreaView>
   );
};
