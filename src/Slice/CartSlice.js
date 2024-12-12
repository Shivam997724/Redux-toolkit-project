import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"


const initialState = {
    carts: [],
    displayedCards: [],
    loading: false,
    error: null,
    currentPage :1,
    itemsPerPage:6
}

export const getAllItems = createAsyncThunk("cart/getAllItems", async () => {
    try {
        const response = await fetch("https://fakestoreapi.com/products")
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
})


const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
            setCurrentPage: (state, action) => {
                state.currentPage = action.payload;
            },
            removeCard: (state, action) => {
                const cardIdToRemove = action.payload;
                state.displayedCards = state.displayedCards.filter((card) => card.id !== cardIdToRemove);
            },
            updateDisplayedCards: (state) => {
                const startIndex = (state.currentPage - 1) * state.itemsPerPage;
                const newDisplayedCards = state.carts.slice(startIndex, startIndex + state.itemsPerPage);
                state.displayedCards = newDisplayedCards;
            },
    },
    extraReducers: (builder) => {
        (builder)
            .addCase(getAllItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllItems.fulfilled, (state, action) => {
                state.loading = false;
                state.carts = action.payload;
                state.displayedCards= action.payload.slice(0,state.itemsPerPage);
            })
            .addCase(getAllItems.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message;
            })

    }
})

export const { setCurrentPage, removeCard, updateDisplayedCards } = CartSlice.actions;

export default CartSlice.reducer;