import { LANGUAGE_OPTIONSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: LANGUAGE_OPTIONSliceType = {
    currLanguage: 'vi',
};

const LANGUAGE_OPTIONSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<LANGUAGE_OPTIONSliceType>) => {
            state.currLanguage = action.payload.currLanguage;
        },
    },
    extraReducers: (builder) => {
        builder;
    },
});

export default LANGUAGE_OPTIONSlice;
