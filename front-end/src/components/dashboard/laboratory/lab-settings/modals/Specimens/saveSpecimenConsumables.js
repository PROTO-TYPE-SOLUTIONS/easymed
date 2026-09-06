import {
  createSpecimenConsumable,
  deleteSpecimenConsumable,
  updateSpecimenConsumable,
} from "@/redux/service/laboratory";

export const consumableErrorText = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  const first = Object.values(data)[0];
  return Array.isArray(first) ? first[0] : String(first ?? fallback);
};

/**
 * Persist the staged consumable rows for a specimen.
 *
 * `originalRows` is what the server currently holds (empty when creating), so
 * rows that are new get created, changed quantities get patched, and rows the
 * user removed get deleted.
 *
 * The specimen itself is already saved by the time this runs, so one failing
 * link must not discard the rest: every call is attempted and the messages for
 * whichever ones failed are returned.
 */
export const saveSpecimenConsumables = async ({
  specimenId,
  rows,
  originalRows = [],
  auth,
}) => {
  const originalByItem = new Map(originalRows.map((row) => [row.item, row]));
  const requests = [];

  rows.forEach((row) => {
    const quantity = parseInt(row.quantity_per_collection) || 1;
    const original = originalByItem.get(row.item);
    if (!original) {
      requests.push(
        createSpecimenConsumable(
          {
            specimen: specimenId,
            item: row.item,
            quantity_per_collection: quantity,
          },
          auth
        )
      );
    } else if (parseInt(original.quantity_per_collection) !== quantity) {
      requests.push(
        updateSpecimenConsumable(
          original.id,
          { quantity_per_collection: quantity },
          auth
        )
      );
    }
  });

  const stagedItems = new Set(rows.map((row) => row.item));
  originalRows
    .filter((original) => !stagedItems.has(original.item))
    .forEach((original) =>
      requests.push(deleteSpecimenConsumable(original.id, auth))
    );

  const results = await Promise.allSettled(requests);
  return results
    .filter((result) => result.status === "rejected")
    .map((result) =>
      consumableErrorText(result.reason, "Could not save a consumable")
    );
};
