/**
 * Pack/subpack display helpers.
 *
 * Throughout the system, quantities are stored in base units (subpacked).
 * e.g. item with packed=1, subpacked=20 and quantity_at_hand=60 means 3 boxes of 20 tablets.
 */

/**
 * Format a stock quantity showing both base units and pack breakdown.
 *
 * @param {object} item          - Inventory item with packed and subpacked fields
 * @param {number} quantityAtHand - Quantity in base units (subpacked)
 * @returns {string}  e.g. "60 units (3 packs of 20)"
 */
export function formatPackQuantity(item, quantityAtHand) {
  const subpacked = parseInt(item?.subpacked) || 1;
  const qty = parseInt(quantityAtHand) || 0;

  if (subpacked <= 1) {
    return `${qty} units`;
  }

  const packs = Math.floor(qty / subpacked);
  const loose = qty % subpacked;

  const packLabel = packs === 1 ? 'pack' : 'packs';
  const looseStr = loose > 0 ? ` + ${loose} loose` : '';

  return `${qty} units (${packs} ${packLabel} of ${subpacked}${looseStr})`;
}

/**
 * Convert a pack quantity entered by staff into base units.
 *
 * @param {number} packs     - Number of packs/boxes received
 * @param {object} item      - Item with subpacked field
 * @returns {number}  Quantity in base units
 */
export function packsToUnits(packs, item) {
  const subpacked = parseInt(item?.subpacked) || 1;
  return (parseInt(packs) || 0) * subpacked;
}

/**
 * Convert base units to packs (floor division).
 *
 * @param {number} units - Quantity in base units
 * @param {object} item  - Item with subpacked field
 * @returns {number}  Number of complete packs
 */
export function unitsToPacks(units, item) {
  const subpacked = parseInt(item?.subpacked) || 1;
  return Math.floor((parseInt(units) || 0) / subpacked);
}

/**
 * Check whether a stock level is at or below the re-order level.
 *
 * @param {object} inventory - Inventory record with quantity_at_hand and re_order_level
 * @returns {boolean}
 */
export function isAtReorderLevel(inventory) {
  const qty = parseInt(inventory?.quantity_at_hand) || 0;
  const reorder = parseInt(inventory?.re_order_level) || 5;
  return qty <= reorder;
}
