import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  ImageIcon,
  Info,
  Loader2,
  Plus,
  Send,
  Ticket,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { EVENT_STATUS_OPTIONS } from "../../../utils/constants";
import { getTodayDate } from "../../../utils/formatedDate";
import { sectionVariantsEaseOut } from "../../../utils/constantsVariants";
import { emptyTicketType } from "../eventFormUtils";

const optionalDateTime = z.string().optional().or(z.literal(""));

// number inputs yield strings; "" must be "missing", not coerced to 0
const requiredNumber = (message) =>
  z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z.number({ error: message }),
  );

const ticketTypeSchema = z
  .object({
    id: z.string().optional(),
    sold: z.number().optional(),
    name: z
      .string()
      .trim()
      .min(1, "*Ticket type is required")
      .max(100, "*Max 100 characters"),
    price: requiredNumber("*Price is required").pipe(
      z.number().min(0, "*Price must be 0 or more"),
    ),
    totalQuantity: requiredNumber("*Quantity is required").pipe(
      z
        .number()
        .int("*Whole numbers only")
        .positive("*Quantity must be greater than 0"),
    ),
    salesStart: optionalDateTime,
    salesEnd: optionalDateTime,
  })
  .refine(
    (ticket) =>
      !ticket.salesStart ||
      !ticket.salesEnd ||
      new Date(ticket.salesEnd) > new Date(ticket.salesStart),
    { message: "*Sales end must be after sales start", path: ["salesEnd"] },
  )
  .refine((ticket) => !ticket.sold || ticket.totalQuantity >= ticket.sold, {
    message: "*Can not be lower than tickets already sold",
    path: ["totalQuantity"],
  });

const buildSchema = (isEdit) =>
  z
    .object({
      title: z
        .string()
        .trim()
        .min(3, "*Event name must be at least 3 characters")
        .max(150, "*Max 150 characters"),
      description: z
        .string()
        .trim()
        .min(10, "*Description must be at least 10 characters"),
      categoryId: z.string().min(1, "*Category is required"),
      imageUrl: z
        .string()
        .trim()
        .url("*Enter a valid image URL (https://...)")
        .optional()
        .or(z.literal("")),
      date: z
        .string()
        .min(1, "*Date is required")
        .refine((value) => isEdit || value >= getTodayDate(), {
          message: "*Date can not be in the past",
        }),
      startTime: z.string().min(1, "*Start time is required"),
      endTime: z.string().min(1, "*End time is required"),
      venue: z
        .string()
        .trim()
        .min(2, "*Venue is required")
        .max(200, "*Max 200 characters"),
      address: z
        .string()
        .trim()
        .min(2, "*Address is required")
        .max(300, "*Max 300 characters"),
      latitude: requiredNumber("*Latitude is required").pipe(
        z.number().min(-90, "*Between -90 and 90").max(90, "*Between -90 and 90"),
      ),
      longitude: requiredNumber("*Longitude is required").pipe(
        z
          .number()
          .min(-180, "*Between -180 and 180")
          .max(180, "*Between -180 and 180"),
      ),
      status: z.enum(["UPCOMING", "PUBLISHED", "CANCELED"]),
      ticketTypes: z
        .array(ticketTypeSchema)
        .min(1, "*Add at least one ticket type"),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "*End time must be after start time",
      path: ["endTime"],
    });

const inputClass = (hasError) =>
  `w-full bg-surface-container-low text-on-surface text-body-md px-space-md py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors placeholder:text-muted-mid ${hasError ? "border-error focus:border-error focus:ring-error" : "border-border-hairline focus:border-primary-ink focus:ring-primary-ink"}`;

function Field({ label, htmlFor, error, hint, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-label-sm uppercase tracking-wider text-secondary-fill"
      >
        {label}
      </label>
      {children}
      {error ? (
        <span className="text-label-md text-error">{error}</span>
      ) : (
        hint && <span className="text-label-md text-muted-dark">{hint}</span>
      )}
    </div>
  );
}

function FormSection({ step, title, description, icon: Icon, children }) {
  return (
    <motion.section
      className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg md:p-space-xl space-y-space-lg"
      initial="hidden"
      animate="visible"
      variants={sectionVariantsEaseOut}
    >
      <div className="flex items-start gap-space-sm border-b border-border-hairline pb-space-md">
        <span className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-ink shrink-0">
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <div>
          <span className="text-label-sm uppercase tracking-widest text-muted-dark">
            Section {step}
          </span>
          <h2 className="text-headline-sm text-primary-ink">{title}</h2>
          {description && (
            <p className="text-body-sm text-body-text">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

/**
 * Shared create / edit event form.
 * onSubmit receives the validated values; the page maps them to API payloads.
 */
export default function EventForm({
  defaultValues,
  isEdit = false,
  onSubmit,
  submitting,
  serverError,
  onCancel,
}) {
  const { categories } = useSelector((state) => state.events);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(buildSchema(isEdit)),
    defaultValues,
    mode: "onTouched",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  // edit mode: values arrive after the event request resolves
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const imageUrl = useWatch({ control, name: "imageUrl" });
  const selectedStatus = useWatch({ control, name: "status" });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, defaultValues))}
      noValidate
      className="flex flex-col gap-space-lg"
    >
      {/* Section 1 — Basic information */}
      <FormSection
        step={1}
        title="Basic Information"
        description="What attendees see first."
        icon={Info}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <Field
            label="Event name"
            htmlFor="title"
            error={errors.title?.message}
            className="md:col-span-2"
          >
            <input
              id="title"
              {...register("title")}
              placeholder="Cairo Tech Summit 2026"
              className={inputClass(errors.title)}
            />
          </Field>
          <Field
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
            className="md:col-span-2"
          >
            <textarea
              id="description"
              rows={5}
              {...register("description")}
              placeholder="Tell attendees what makes this event worth attending..."
              className={`${inputClass(errors.description)} resize-y`}
            />
          </Field>
          <Field
            label="Category"
            htmlFor="categoryId"
            error={errors.categoryId?.message}
          >
            <select
              id="categoryId"
              {...register("categoryId")}
              className={`cursor-pointer ${inputClass(errors.categoryId)}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Event image URL"
            htmlFor="imageUrl"
            error={errors.imageUrl?.message}
            hint="Optional. A 16:10 landscape image works best."
          >
            <input
              id="imageUrl"
              type="url"
              {...register("imageUrl")}
              placeholder="https://..."
              className={inputClass(errors.imageUrl)}
            />
          </Field>
          {imageUrl && !errors.imageUrl && (
            <div className="md:col-span-2 aspect-[16/6] rounded-xl overflow-hidden bg-surface-container border border-border-hairline">
              <img
                src={imageUrl}
                alt="Event preview"
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          {!imageUrl && (
            <div className="md:col-span-2 flex items-center gap-space-sm text-body-sm text-muted-dark">
              <ImageIcon size={16} strokeWidth={1.5} />
              Without an image the EventVerse default cover is used.
            </div>
          )}
        </div>
      </FormSection>

      {/* Section 2 — Date & location */}
      <FormSection
        step={2}
        title="Date & Location"
        description="When and where the event takes place."
        icon={CalendarDays}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <Field label="Date" htmlFor="date" error={errors.date?.message}>
            <input
              id="date"
              type="date"
              min={isEdit ? undefined : getTodayDate()}
              {...register("date")}
              className={`cursor-pointer ${inputClass(errors.date)}`}
            />
          </Field>
          <Field
            label="Start time"
            htmlFor="startTime"
            error={errors.startTime?.message}
          >
            <input
              id="startTime"
              type="time"
              {...register("startTime")}
              className={`cursor-pointer ${inputClass(errors.startTime)}`}
            />
          </Field>
          <Field label="End time" htmlFor="endTime" error={errors.endTime?.message}>
            <input
              id="endTime"
              type="time"
              {...register("endTime")}
              className={`cursor-pointer ${inputClass(errors.endTime)}`}
            />
          </Field>
          <Field
            label="Venue"
            htmlFor="venue"
            error={errors.venue?.message}
            className="sm:col-span-3 md:col-span-1"
          >
            <input
              id="venue"
              {...register("venue")}
              placeholder="Cairo International Convention Center"
              className={inputClass(errors.venue)}
            />
          </Field>
          <Field
            label="Address"
            htmlFor="address"
            error={errors.address?.message}
            className="sm:col-span-3 md:col-span-2"
          >
            <input
              id="address"
              {...register("address")}
              placeholder="Nasr City, Cairo, Egypt"
              className={inputClass(errors.address)}
            />
          </Field>
          <Field
            label="Latitude"
            htmlFor="latitude"
            error={errors.latitude?.message}
            hint="Decimal degrees, e.g. 30.0444"
          >
            <input
              id="latitude"
              type="number"
              step="any"
              inputMode="decimal"
              {...register("latitude")}
              placeholder="30.0444"
              className={inputClass(errors.latitude)}
            />
          </Field>
          <Field
            label="Longitude"
            htmlFor="longitude"
            error={errors.longitude?.message}
            hint="Decimal degrees, e.g. 31.2357"
          >
            <input
              id="longitude"
              type="number"
              step="any"
              inputMode="decimal"
              {...register("longitude")}
              placeholder="31.2357"
              className={inputClass(errors.longitude)}
            />
          </Field>
        </div>
      </FormSection>

      {/* Section 3 — Tickets */}
      <FormSection
        step={3}
        title="Tickets"
        description="Ticket types, pricing and inventory."
        icon={Ticket}
      >
        <div className="flex flex-col gap-space-md">
          {fields.map((field, index) => {
            const ticketErrors = errors.ticketTypes?.[index];
            return (
              <div
                key={field.id}
                className="rounded-2xl border border-border-hairline bg-canvas p-space-md md:p-space-lg space-y-space-md"
              >
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="text-label-sm uppercase tracking-widest text-muted-dark">
                    Ticket type {index + 1}
                    {field.sold > 0 && (
                      <span className="ml-2 normal-case tracking-normal text-warning">
                        · {field.sold} sold
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1 || field.sold > 0}
                    title={
                      field.sold > 0
                        ? "Ticket types with bookings can not be removed"
                        : undefined
                    }
                    aria-label={`Remove ticket type ${index + 1}`}
                    className="cursor-pointer inline-flex items-center gap-1 px-space-sm py-1.5 rounded-xl text-label-md text-error hover:bg-error-container/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
                  <Field
                    label="Ticket type"
                    htmlFor={`ticket-name-${index}`}
                    error={ticketErrors?.name?.message}
                    className="lg:col-span-1"
                  >
                    <input
                      id={`ticket-name-${index}`}
                      {...register(`ticketTypes.${index}.name`)}
                      placeholder="General Admission"
                      className={inputClass(ticketErrors?.name)}
                    />
                  </Field>
                  <Field
                    label="Price ($)"
                    htmlFor={`ticket-price-${index}`}
                    error={ticketErrors?.price?.message}
                  >
                    <input
                      id={`ticket-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      {...register(`ticketTypes.${index}.price`)}
                      placeholder="25"
                      className={inputClass(ticketErrors?.price)}
                    />
                  </Field>
                  <Field
                    label="Quantity"
                    htmlFor={`ticket-qty-${index}`}
                    error={ticketErrors?.totalQuantity?.message}
                  >
                    <input
                      id={`ticket-qty-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      {...register(`ticketTypes.${index}.totalQuantity`)}
                      placeholder="200"
                      className={inputClass(ticketErrors?.totalQuantity)}
                    />
                  </Field>
                  <Field
                    label="Sales start"
                    htmlFor={`ticket-start-${index}`}
                    error={ticketErrors?.salesStart?.message}
                    hint="Optional"
                  >
                    <input
                      id={`ticket-start-${index}`}
                      type="datetime-local"
                      {...register(`ticketTypes.${index}.salesStart`)}
                      className={`cursor-pointer ${inputClass(ticketErrors?.salesStart)}`}
                    />
                  </Field>
                  <Field
                    label="Sales end"
                    htmlFor={`ticket-end-${index}`}
                    error={ticketErrors?.salesEnd?.message}
                    hint="Optional"
                  >
                    <input
                      id={`ticket-end-${index}`}
                      type="datetime-local"
                      {...register(`ticketTypes.${index}.salesEnd`)}
                      className={`cursor-pointer ${inputClass(ticketErrors?.salesEnd)}`}
                    />
                  </Field>
                </div>
              </div>
            );
          })}
          {errors.ticketTypes?.root?.message || errors.ticketTypes?.message ? (
            <span className="text-label-md text-error">
              {errors.ticketTypes?.root?.message || errors.ticketTypes?.message}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => append({ ...emptyTicketType })}
            className="cursor-pointer self-start inline-flex items-center gap-space-xs border border-border-hairline text-primary-ink text-label-lg px-space-md py-2.5 rounded-xl hover:bg-surface-container-low hover:border-muted-dark transition-colors"
          >
            <Plus size={16} />
            Add ticket type
          </button>
        </div>
      </FormSection>

      {/* Section 4 — Publishing */}
      <FormSection
        step={4}
        title="Publishing"
        description="Control the event's visibility and booking state."
        icon={Send}
      >
        <div
          role="radiogroup"
          className="grid grid-cols-1 md:grid-cols-3 gap-space-md"
        >
          {EVENT_STATUS_OPTIONS.filter(
            // a brand new event can not start out cancelled
            (option) => isEdit || option.value !== "CANCELED",
          ).map((option) => {
            const checked = selectedStatus === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer flex items-start gap-space-sm p-space-md rounded-2xl border transition-colors ${checked ? "border-primary-ink bg-surface-container-low" : "border-border-hairline hover:border-muted-dark"}`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register("status")}
                  className="mt-1 accent-primary-ink w-4 h-4"
                />
                <span>
                  <span className="block text-label-lg text-primary-ink">
                    {option.label}
                  </span>
                  <span className="text-body-sm text-body-text">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </FormSection>

      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 p-3.5 px-4 rounded-xl bg-error-container/40 text-on-error-container border border-error/20"
        >
          <AlertCircle size={18} className="shrink-0 text-error" />
          <span className="text-label-md text-error font-semibold">
            {serverError}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 -mx-gutter-mobile sm:mx-0 px-gutter-mobile sm:px-space-lg py-space-md bg-surface/95 backdrop-blur-md border-t sm:border border-border-hairline sm:rounded-2xl flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-space-sm">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer inline-flex justify-center items-center border border-border-hairline text-primary-ink text-label-lg px-space-lg py-2.5 rounded-xl hover:bg-surface-container-low hover:border-muted-dark transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || (isEdit && !isDirty)}
          className="cursor-pointer inline-flex justify-center items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-lg py-2.5 rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
