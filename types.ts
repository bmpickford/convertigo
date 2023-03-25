import * as zod from "zod";

export const validEvents = [
  "search",
  "view",
  "add_to_cart",
  "conversion",
] as const;

export const event = zod.object({
  type: zod.enum(validEvents),
  user: zod.string(),
});
export type Event = zod.infer<typeof event>;

export const searchEvent = event.extend({
  type: zod.literal("search"),
  query: zod.string(),
});
export type SearchEvent = zod.infer<typeof searchEvent>;

export const viewEvent = event.extend({
  type: zod.literal("view"),
  item_id: zod.string(),
});
export type ViewEvent = zod.infer<typeof viewEvent>;

export const addToCartEvent = event.extend({
  type: zod.literal("add_to_cart"),
  item_id: zod.string(),
});
export type AddToCartEvent = zod.infer<typeof addToCartEvent>;

export const conversionEvent = event.extend({
  type: zod.literal("conversion"),
  item_id: zod.string(),
});
export type ConversionEvent = zod.infer<typeof conversionEvent>;

export type AnyEvent =
  | SearchEvent
  | ViewEvent
  | AddToCartEvent
  | ConversionEvent;

export const isSearchEvent = (event: Event): event is SearchEvent =>
  event.type === "search";
export const isViewEvent = (event: Event): event is ViewEvent =>
  event.type === "view";
export const isAddToCartEvent = (event: Event): event is AddToCartEvent =>
  event.type === "add_to_cart";
export const isConversionEvent = (event: Event): event is ConversionEvent =>
  event.type === "conversion";
