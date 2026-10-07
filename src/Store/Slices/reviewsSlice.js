import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createReviewService,
  deleteReviewService,
  getEventReviewsService,
} from "../../Services/reviewServices";
import { toRejectValue } from "../../utils/apiError";

export const getEventReviews = createAsyncThunk(
  "reviews/forEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await getEventReviewsService(eventId);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load reviews."));
    }
  },
);

export const createReview = createAsyncThunk(
  "reviews/create",
  async ({ eventId, rating, comment }, { rejectWithValue, dispatch }) => {
    try {
      const body = comment?.trim()
        ? { rating, comment: comment.trim() }
        : { rating };
      const review = await createReviewService(eventId, body);
      // refresh average / count from the server
      dispatch(getEventReviews(eventId));
      return review;
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not submit review."));
    }
  },
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async ({ reviewId, eventId }, { rejectWithValue, dispatch }) => {
    try {
      await deleteReviewService(reviewId);
      dispatch(getEventReviews(eventId));
      return reviewId;
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not delete review."));
    }
  },
);

const initialState = {
  eventId: null,
  reviews: [],
  averageRating: null,
  reviewCount: 0,
  loading: false,
  error: null,
  submitLoading: false,
  submitError: null,
  deletingId: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEventReviews.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // only wipe the list when switching to another event
        if (state.eventId !== action.meta.arg) {
          state.eventId = action.meta.arg;
          state.reviews = [];
          state.averageRating = null;
          state.reviewCount = 0;
        }
      })
      .addCase(getEventReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.averageRating = action.payload.averageRating;
        state.reviewCount = action.payload.reviewCount;
      })
      .addCase(getEventReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.error.message;
      })
      .addCase(createReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.submitLoading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload?.message ?? action.error.message;
      })
      .addCase(deleteReview.pending, (state, action) => {
        state.deletingId = action.meta.arg.reviewId;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deletingId = null;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload,
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deletingId = null;
        state.submitError = action.payload?.message ?? action.error.message;
      });
  },
});

export const { clearReviewError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
