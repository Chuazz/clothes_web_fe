import { filterSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialFilterState: filterSliceType = {
    categories_code: [],
    min_price: 0,
    max_price: 0,
    locations_code: [],
    keyword: '',
};

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialFilterState,
    reducers: {
        setFilter: (state, action: PayloadAction<filterSliceType>) => {
            return { ...state, ...action.payload };
        },
        resetFilter: (state) => {
            return initialFilterState;
        },
    },
    extraReducers: (builder) => {
        builder;
    },
});

export { initialFilterState };
export default filterSlice;
