import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageSquareText, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sectionVariants } from "../../../utils/constantsVariants";
import { formatedLocalDate } from "../../../utils/formatedDate";
import RatingStars from "../common/RatingStars";
import {
  createReview,
  deleteReview,
  getEventReviews,
} from "../../../Store/Slices/reviewsSlice";
import {
  showConfirmDialog,
  showSuccessAlert,
} from "../../../utils/sweetAlertNotifications";

const MAX_COMMENT = 1000;

export default function EventReviews({ eventId }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {
    reviews,
    averageRating,
    reviewCount,
    loading,
    error,
    submitLoading,
    submitError,
    deletingId,
  } = useSelector((state) => state.reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  const isAttendee = user?.role?.toLowerCase() === "user";
  const hasReviewed = reviews.some((review) => review.userId === user?.id);
  const canReview = isAuthenticated && isAttendee && !hasReviewed;

  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) {
      setFormError("*Please choose a rating between 1 and 5 stars");
      return;
    }
    setFormError("");
    const result = await dispatch(createReview({ eventId, rating, comment }));
    if (createReview.fulfilled.match(result)) {
      setRating(0);
      setComment("");
      showSuccessAlert("Thank you!", "Your review has been published.");
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = await showConfirmDialog({
      title: "Delete review?",
      message: "Your rating and comment will be removed.",
      confirmText: "Delete",
      danger: true,
    });
    if (confirmed) dispatch(deleteReview({ reviewId, eventId }));
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-lg"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
          Reviews & Ratings
        </span>
        <span className="font-label-md text-label-md text-secondary">
          {reviewCount} review{reviewCount === 1 ? "" : "s"}
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-space-lg items-center">
        <div className="flex flex-col items-start gap-space-xs">
          <span className="text-display-hero-mobile text-primary-ink">
            {averageRating ? averageRating.toFixed(1) : "—"}
          </span>
          <RatingStars value={averageRating ?? 0} />
          <span className="text-body-sm text-body-text">
            Average from {reviewCount} rating{reviewCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="space-y-1.5">
          {breakdown.map(({ stars, count }) => {
            const percent = reviews.length
              ? Math.round((count / reviews.length) * 100)
              : 0;
            return (
              <div key={stars} className="flex items-center gap-space-sm">
                <span className="w-10 text-label-md text-secondary-fill">
                  {stars} ★
                </span>
                <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-ink transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-label-md text-muted-dark">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      {canReview && (
        <form
          onSubmit={handleSubmit}
          className="p-space-md md:p-space-lg rounded-2xl bg-surface-container-low border border-border-hairline space-y-space-md"
        >
          <div>
            <h3 className="text-headline-sm text-primary-ink">
              How was the event?
            </h3>
            <p className="text-body-sm text-body-text">
              Share your experience with other attendees.
            </p>
          </div>
          <RatingStars value={rating} onChange={setRating} size={28} />
          <div>
            <label htmlFor="review-comment" className="sr-only">
              Your review
            </label>
            <textarea
              id="review-comment"
              rows={4}
              maxLength={MAX_COMMENT}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write your review..."
              className="w-full bg-surface-container-lowest text-on-surface text-body-md px-space-md py-space-sm rounded-xl border border-border-hairline focus:outline-none focus:border-primary-ink focus:ring-1 focus:ring-primary-ink resize-y"
            />
            <div className="flex justify-between mt-1 text-label-md">
              <span className="text-error">{formError || submitError}</span>
              <span className="text-muted-dark">
                {comment.length}/{MAX_COMMENT}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitLoading}
            className="cursor-pointer inline-flex items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-lg py-space-sm rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {submitLoading && <Loader2 size={16} className="animate-spin" />}
            Submit Review
          </button>
        </form>
      )}

      {/* List */}
      {loading && reviews.length === 0 ? (
        <div className="space-y-space-md">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse space-y-2">
              <div className="h-4 w-40 rounded bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-space-md p-space-md rounded-xl bg-error-container/40">
          <span className="text-body-sm text-on-error-container">{error}</span>
          <button
            type="button"
            onClick={() => dispatch(getEventReviews(eventId))}
            className="cursor-pointer text-label-lg text-primary-ink underline"
          >
            Try Again
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center text-center py-space-lg">
          <MessageSquareText
            size={28}
            strokeWidth={1.5}
            className="text-muted-mid mb-space-sm"
          />
          <p className="text-label-lg text-primary-ink">No reviews yet</p>
          <p className="text-body-sm text-body-text">
            Be the first to share how this event was.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border-hairline">
          {reviews.map((review) => {
            const isOwn = review.userId === user?.id;
            return (
              <li key={review.id} className="py-space-md first:pt-0">
                <div className="flex items-start justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary-ink text-on-primary flex items-center justify-center text-label-md shrink-0">
                      {review.user?.name?.slice(0, 2).toUpperCase() ?? "EV"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-label-lg text-primary-ink truncate">
                        {review.user?.name ?? "Attendee"}
                        {isOwn && (
                          <span className="ml-2 text-label-sm uppercase text-muted-dark">
                            You
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-space-sm">
                        <RatingStars value={review.rating} size={14} />
                        <span className="text-label-md text-muted-dark">
                          {formatedLocalDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwn && (
                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      aria-label="Delete review"
                      className="cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center text-error hover:bg-error-container/40 transition-colors disabled:opacity-50"
                    >
                      {deletingId === review.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} strokeWidth={1.5} />
                      )}
                    </button>
                  )}
                </div>
                {review.comment && (
                  <p className="mt-space-sm text-body-md text-body-text whitespace-pre-line break-words">
                    {review.comment}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </motion.section>
  );
}
