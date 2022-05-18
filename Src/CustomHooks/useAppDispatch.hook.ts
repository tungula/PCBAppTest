import {useDispatch} from 'react-redux';
import type {AppDispatch} from '../Store/config';

export const useCustomDispatch = () => useDispatch<AppDispatch>();
