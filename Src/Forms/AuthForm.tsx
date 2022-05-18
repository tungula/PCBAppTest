import {Formik} from 'formik';
import React from 'react';
import {BlurButton} from '../Components/BlurButton/BlurButton';
import {BlurButtonVariant} from '../Constants/Enums';

import {Input} from '../Primitives/Input/Input';
import {registrationSchema} from '../ValidationSchemas/AuthValidations';

interface Props {
   onSubmit: () => void;
   login: (email: string, password: string) => void;
}

export const AuthForm: React.FC<Props> = ({
   onSubmit = () => {},
   login = () => {},
}) => {
   return (
      <Formik
         initialValues={{
            firstName: '',
            lastName: '',
         }}
         onSubmit={(values) => {
            login(values.firstName, values.lastName);
         }}
         validationSchema={registrationSchema}>
         {({
            handleBlur,
            handleChange,
            setFieldValue,
            errors,
            values,
            touched,
            handleSubmit,
            setFieldTouched,
            setFieldError,
         }) => {
            return (
               <>
                  <Input
                     placeholder={'First Name'}
                     value={values.firstName}
                     onChangeText={(val) => {
                        setFieldValue('firstName', val);
                     }}
                     maxLength={65}
                  />
                  <Input
                     placeholder={'Last Name'}
                     value={values.lastName}
                     onChangeText={(val) => {
                        setFieldValue('lastName', val);
                     }}
                     maxLength={65}
                  />
                  <BlurButton
                     onPress={handleSubmit}
                     wrapperStyle={{
                        borderRadius: 5,
                        backgroundColor: 'rgba(255,0,0,.8)',
                     }}
                     variant={BlurButtonVariant.large}
                     btnLabel={'Submit'}
                  />
               </>
            );
         }}
      </Formik>
   );
};
