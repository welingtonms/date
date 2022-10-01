/**
 * Minimum supported `Date` ([Source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps)).
 * Same as XBDateFactory( 0 ).getTime()
 */
export const MIN_SUPPORTED_DATE = 43200000;
/**
 * Maximum supported `Date` ([Source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps)).
 * Same as XBDateFactory( 8.64e15 - 1 ).getTime()
 */
export const MAX_SUPPORTED_DATE = 8639999956800000;
