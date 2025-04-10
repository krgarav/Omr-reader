import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    coordinates:[]
}

const coordinateSlice = createSlice({
    name: "Coordinates",
    initialState,
    reducers: {
        addCoordinates:(state,action)=>{
            state.coordinates.push(action.payload)
        }
    }
})


export const {addCoordinates} = coordinateSlice.actions;

export default coordinateSlice.reducer;