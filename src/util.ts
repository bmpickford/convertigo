import {
  isSearchEvent,
  isViewEvent,
  isAddToCartEvent,
  isConversionEvent,
  searchEvent,
  viewEvent,
  addToCartEvent,
  conversionEvent,
  AnyEvent,
} from "./types.js";

export const getParsedBody = (body: any): AnyEvent | null => {
  if (isSearchEvent(body)) {
    return searchEvent.parse(body);
  } else if (isViewEvent(body)) {
    return viewEvent.parse(body);
  } else if (isAddToCartEvent(body)) {
    return addToCartEvent.parse(body);
  } else if (isConversionEvent(body)) {
    return conversionEvent.parse(body);
  }
  return null;
};
