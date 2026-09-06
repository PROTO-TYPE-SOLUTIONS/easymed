import React, { useState } from "react";
import Select from "react-select";
import { Grid } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";

/**
 * Stages the consumables a specimen burns per collection so they can be saved
 * in the same action as the specimen itself.
 *
 * Rows are held by the parent: each is
 * { id?, item, item_name, quantity_per_collection }.
 * `id` is present only for links already persisted (edit flow); rows without
 * one are created on save.
 */
const SpecimenConsumablesField = ({ specimenName, options, rows, setRows }) => {
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");

  // Only saved links carry a stock level; there is nothing to show while a row
  // is still being staged on the add form.
  const showStock = rows.some((row) => row.available_quantity != null);

  // A consumable can only be linked to a specimen once (unique_together on the
  // backend), so drop the ones already staged.
  const unusedOptions = options.filter(
    (option) => !rows.some((row) => row.item === option.value)
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
        item: selected.value,
        item_name: selected.label,
        quantity_per_collection: parsed,
      },
    ]);
    setSelected(null);
    setQuantity("1");
  };

  const removeRow = (item) => setRows(rows.filter((row) => row.item !== item));

  const changeQuantity = (item, value) =>
    setRows(
      rows.map((row) =>
        row.item === item ? { ...row, quantity_per_collection: value } : row
      )
    );

  // Blanking the box while typing is fine, but it can't be left empty.
  const normaliseQuantity = (item, value) => {
    const parsed = parseInt(value);
    changeQuantity(item, !parsed || parsed < 1 ? 1 : parsed);
  };

  return (
    <div>
      <h3 className="font-bold">Consumables used</h3>
      <p className="mb-4 text-sm text-gray">
        Deducted from stock once each time a{" "}
        {specimenName ? `${specimenName} ` : ""}sample is collected &mdash; not
        once per test. One blood draw serves every blood panel on the request,
        so it consumes one syringe and one tube no matter how many panels were
        ordered.
      </p>

      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={6} xs={12}>
          <label htmlFor="specimen-consumable">Consumable</label>
          <Select
            inputId="specimen-consumable"
            isSearchable
            isClearable
            placeholder="Syringe, needle, tube..."
            value={selected}
            onChange={(option) => {
              setSelected(option);
              setError("");
            }}
            options={unusedOptions}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <label htmlFor="specimen-consumable-qty">Qty per collection</label>
          <input
            id="specimen-consumable-qty"
            className="block border border-gray py-2 px-4 focus:outline-none w-full"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => {
              // This sits inside the specimen form; Enter here means "stage
              // this consumable", not "submit the specimen".
              if (e.key === "Enter") {
                e.preventDefault();
                addRow();
              }
            }}
          />
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
      {error && <div className="text-warning text-xs mt-1">{error}</div>}

      <table className="w-full my-6 text-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th className="text-left py-2 px-4">Consumable</th>
            <th className="text-left py-2 px-4">Qty per collection</th>
            {showStock && <th className="text-left py-2 px-4">In stock</th>}
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={showStock ? 4 : 3} className="py-4 px-4 text-center">
                No consumables added. Collecting this specimen will not deduct
                any stock.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.item} className="border-b border-gray">
              <td className="py-2 px-4">{row.item_name}</td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  min="1"
                  value={row.quantity_per_collection}
                  onChange={(e) => changeQuantity(row.item, e.target.value)}
                  onBlur={(e) => normaliseQuantity(row.item, e.target.value)}
                  className="border border-gray py-1 px-2 w-20 focus:outline-none"
                />
              </td>
              {showStock && (
                <td className="py-2 px-4">
                  <span
                    className={
                      row.available_quantity != null &&
                      row.available_quantity < parseInt(row.quantity_per_collection)
                        ? "text-warning"
                        : ""
                    }
                  >
                    {row.available_quantity ?? "-"}
                  </span>
                </td>
              )}
              <td className="py-2 px-4 text-right">
                <AiFillDelete
                  onClick={() => removeRow(row.item)}
                  className="text-warning text-xl cursor-pointer inline"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecimenConsumablesField;
