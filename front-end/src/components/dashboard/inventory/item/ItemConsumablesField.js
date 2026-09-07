import React, { useState } from "react";
import Select from "react-select";
import { Grid } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";

/**
 * Stages the accompaniments an item uses up, so they can be saved in the same
 * action as the item itself.
 *
 * Rows are held by the parent, each shaped
 * { id?, consumable, consumable_name, quantity_per_use, is_required,
 *   available_quantity? }.
 * `id` is present only for links already persisted (edit flow); rows without
 * one are created on save. `available_quantity` only comes back from the
 * server, so it is blank while a row is still being staged.
 */
const ItemConsumablesField = ({ itemName, options, rows, setRows }) => {
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [required, setRequired] = useState(true);
  const [error, setError] = useState("");

  const showStock = rows.some((row) => row.available_quantity != null);

  // A consumable can only be linked to an item once (unique_together on the
  // backend), so drop the ones already staged.
  const unusedOptions = options.filter(
    (option) => !rows.some((row) => row.consumable === option.value)
  );

  const addRow = () => {
    if (!selected) {
      setError("Select a consumable");
      return;
    }
    const parsed = parseInt(quantity);
    if (!parsed || parsed < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    setError("");
    setRows([
      ...rows,
      {
        consumable: selected.value,
        consumable_name: selected.label,
        quantity_per_use: parsed,
        is_required: required,
      },
    ]);
    setSelected(null);
    setQuantity("1");
    setRequired(true);
  };

  const removeRow = (consumable) =>
    setRows(rows.filter((row) => row.consumable !== consumable));

  const patchRow = (consumable, patch) =>
    setRows(
      rows.map((row) =>
        row.consumable === consumable ? { ...row, ...patch } : row
      )
    );

  // Blanking the box while typing is fine, but it can't be left empty.
  const normaliseQuantity = (consumable, value) => {
    const parsed = parseInt(value);
    patchRow(consumable, { quantity_per_use: !parsed || parsed < 1 ? 1 : parsed });
  };

  return (
    <div>
      <h3 className="font-bold">Consumables (accompaniments)</h3>
      <p className="mb-4 text-sm text-gray">
        What is used up alongside {itemName ? `${itemName}` : "this item"} every
        time it is sold, dispensed or run &mdash; a syringe and a swab for an
        injection, a container for a sample. Tablets need none, so leave this
        empty for them. <span className="font-semibold">Required</span>{" "}
        accompaniments block billing when they are out of stock; optional ones
        only warn.
      </p>

      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={5} xs={12}>
          <label htmlFor="item-consumable">Consumable</label>
          <Select
            inputId="item-consumable"
            isSearchable
            isClearable
            placeholder="Syringe, swab, container..."
            value={selected}
            onChange={(option) => {
              setSelected(option);
              setError("");
            }}
            options={unusedOptions}
          />
        </Grid>
        <Grid item md={2} xs={6}>
          <label htmlFor="item-consumable-qty">Qty per use</label>
          <input
            id="item-consumable-qty"
            className="block border border-gray py-2 px-4 focus:outline-none w-full"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => {
              // This sits inside the item form; Enter here means "stage this
              // consumable", not "submit the item".
              if (e.key === "Enter") {
                e.preventDefault();
                addRow();
              }
            }}
          />
        </Grid>
        <Grid item md={2} xs={6}>
          <label className="flex items-center gap-2 pb-2" htmlFor="item-consumable-required">
            <input
              id="item-consumable-required"
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            <span className="text-sm">Required</span>
          </label>
        </Grid>
        <Grid item md={3} xs={12}>
          <button
            type="button"
            onClick={addRow}
            className="border border-primary text-primary px-4 py-2 w-full"
          >
            Add Consumable
          </button>
        </Grid>
      </Grid>

      {error && <p className="text-warning text-xs mt-1">{error}</p>}

      {rows.length > 0 && (
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left border-b border-gray">
              <th className="py-2">Consumable</th>
              <th className="py-2 w-32">Qty per use</th>
              <th className="py-2 w-28">Required</th>
              {showStock && <th className="py-2 w-28">In stock</th>}
              <th className="py-2 w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.consumable} className="border-b border-gray">
                <td className="py-2">{row.consumable_name}</td>
                <td className="py-2">
                  <input
                    className="border border-gray py-1 px-2 w-24"
                    type="number"
                    min="1"
                    value={row.quantity_per_use}
                    onChange={(e) =>
                      patchRow(row.consumable, { quantity_per_use: e.target.value })
                    }
                    onBlur={(e) => normaliseQuantity(row.consumable, e.target.value)}
                  />
                </td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={!!row.is_required}
                    onChange={(e) =>
                      patchRow(row.consumable, { is_required: e.target.checked })
                    }
                  />
                </td>
                {showStock && (
                  <td
                    className={`py-2 ${
                      row.available_quantity != null &&
                      row.available_quantity < row.quantity_per_use
                        ? "text-warning font-semibold"
                        : ""
                    }`}
                  >
                    {row.available_quantity ?? "—"}
                  </td>
                )}
                <td className="py-2">
                  <AiFillDelete
                    className="text-warning cursor-pointer"
                    onClick={() => removeRow(row.consumable)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemConsumablesField;
