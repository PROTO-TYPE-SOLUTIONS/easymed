# Inventory: End-to-End Flow

How a product gets into EasyMed and onto the shelf — from creating the item,
through requisition and local purchase order, to receiving the goods and seeing
the stock update.

Written to be read start to finish. Every figure in the worked examples is what
the system actually produces.

---

## The one rule everything rests on

**Stock is always counted in the item's smallest unit.**

You order in boxes. You receive in boxes. But the moment goods are accepted,
the system converts once and stores tablets, pairs, tests or millilitres — and
never converts again.

That single decision is why the numbers reconcile. Dispensing three tablets,
consuming one syringe on a blood draw, and writing off an expired vial all
speak the same language, so the stock figure on screen is the stock figure in
the ward.

| Level | What it is | Example |
| --- | --- | --- |
| **Base unit** | The smallest thing you can issue. Required on every item. | `pairs` |
| **Pack size** | A container bigger than the base unit, with how many it holds. | `Box` = 100 pairs |

A pack always states its size against the **base unit**, never against the pack
below it. A carton of ten boxes of twelve is recorded as `120`, not `10`. This
means correcting a box size can never silently change what a carton means.

---

## The five stages

```
  1. CREATE THE ITEM          Inventory > Items > Add New Item
     What it is, what unit it is counted in, which departments use it
              |
              v
  2. RAISE A REQUISITION      Inventory > Create Requisition
     A department asks for goods, in the unit they want to order in
              |
              v
  3. APPROVE AND ORDER        Inventory > Requisitions (department)
                              Finance > Accounts Payable > Purchase Orders
     Both sides approve, procurement sets quantities, LPO is generated
              |
              v
  4. RECEIVE THE GOODS        Finance > Accounts Payable > Receive Items
     Supplier invoice + goods received note + what physically arrived
              |
              v
  5. STOCK UPDATES            Inventory (main list)
     One ledger entry per receipt. Quantity and cost update together.
```

Stages 1 and 2 are usually different people; 3 and 4 are usually procurement
and stores. Nothing skips a stage: you cannot receive against an order that
does not exist, and you cannot order an item that was never created.

---

## Stage 1 — Create the item

**Inventory → Items → Add New Item**

| Field | What it means | Example |
| --- | --- | --- |
| Item Name | What staff will search for | `Examination Gloves` |
| Category | What kind of thing it is — this decides whether it holds stock | `Lab Consumable` |
| Base Unit | The smallest unit you issue | `pairs` |
| Departments | Who uses it. Tag `General` to share with everyone | `Lab`, `Radiology` |
| Description | Free text | `Powder-free nitrile` |

Then, on the item's row menu, **Pack Sizes** — add the containers you buy in:

| Pack name | Holds | Notes |
| --- | --- | --- |
| `Box` | 100 | Tick "purchase default" so it is preselected when receiving |
| `Carton` | 1200 | 12 boxes, stated against the base unit |

### Categories that hold stock, and categories that do not

| Holds stock | Does not hold stock (billable services) |
| --- | --- |
| Surgical Equipment | Lab Test |
| Lab Reagent | General Appointment |
| Lab Consumable | Specialized Appointment |
| Drug | |
| Furniture | |
| General | |

This distinction matters more than it looks. A **Lab Test** is something you
charge for, not something you hold — so the system refuses to stock it. If you
create a physical product under a service category by mistake, you will be
stopped at the requisition with a message telling you to correct the category
first. Changing the category to a stock-holding one makes the item stockable
again immediately.

> **Naming rule:** a pack cannot be called the same thing as the base unit. An
> item counted in `kits` with a pack called `Kit` would read "1 Kit = 500 kits",
> which means nothing. The system rejects it and explains why. Name the base
> unit for what it actually counts — `tests`, `ml`, `tablets` — and keep the
> container name for the pack.

---

## Stage 2 — Raise a requisition

**Inventory → Create Requisition**

A department states what it needs. Each line carries:

- the **item**
- the **quantity**, in whichever unit the "Order in" selector is set to
- the **preferred supplier**

The unit is chosen **once**, here, and every later stage reads it back. The
purchase order does not copy it, so the order and the requisition can never
drift apart.

Requisitions are numbered by department, date and a random suffix:

```
RAD/26/09/06/7455
 |    |  |  |    \_ random, to avoid collisions
 |    |  |  \______ day
 |    |  \_________ month
 |    \____________ year
 \_________________ first three letters of the department
```

**Important:** `6` on a requisition line means **6 boxes**, not 6 pairs. Every
screen that shows a quantity also shows the unit, and the purchase order note
prints both — "6 Box · 600 pairs in total" — so there is no ambiguity with the
supplier.

---

## Stage 3 — Approve and generate the LPO

**Finance → Accounts Payable → Purchase Orders → open a requisition**

Two approvals, then the order:

**1. The department approves** its own requisition — **Inventory → Requisitions**.
This is what puts it in front of procurement.

**2. Procurement approves** the quantities — they can approve less than was
requested, and a line approved for zero is simply not ordered.

**3. Generate PO.** Tick the lines to order, then **Generate PO**. The selected
lines become one purchase order, numbered `PO/26/09/06/6753`.

> Tick lines from one supplier at a time. The purchase order takes its supplier
> from the first line you select, so a mixed selection would put every line on
> that one supplier's order.

The requisition's status tracks this automatically — it is worked out from the
approvals and how many lines have been ordered, so it can never disagree with
the underlying facts:

| Status | Meaning |
| --- | --- |
| `Pending` | Raised, awaiting the department's approval |
| `Department approved` | Waiting on procurement |
| `Procurement approved` | Cleared to order |
| `Partially ordered` | Some lines are on a purchase order |
| `Ordered` | Every approved line has been ordered |
| `Rejected` | Procurement declined it |
| `Cancelled` | Withdrawn by the requesting side |

Rejecting or cancelling requires a reason, and records who did it and when.
Both can be undone with **Reopen** if done in error. Neither is allowed once
any line has been ordered — a purchase order is a commitment to a supplier, so
the order has to be dealt with first.

---

## Stage 4 — Receive the goods

**Finance → Accounts Payable → Receive Items → open the purchase order**

One screen captures the whole delivery:

- **Supplier invoice** — invoice number and status
- **Goods received note** — any note about the delivery, numbered
  `20260906-GRN-82F074`
- **The lines** — what actually arrived, with quantity, price per pack,
  lot/batch number and expiry date where relevant

Press submit and all three are written **together, in one transaction**. If any
line is wrong, nothing at all is saved — no invoice, no GRN, no stock. You
cannot end up with an invoice on file for goods that never arrived.

Two details worth knowing:

- **The invoice is priced from the lines, not the form.** Whatever you type as
  an amount, the invoice is worth what actually arrived. Six boxes at
  KES 1,200 makes the invoice KES 7,200.
- **Expiry date is optional.** Most goods do not have one; leave it blank.
- **The same invoice number cannot be recorded twice.**

### Partial deliveries

Receive what arrived. The purchase order tracks the rest:

| PO status | Meaning |
| --- | --- |
| `Pending` | Nothing received yet |
| `Partial` | Some received, more outstanding |
| `Completed` | Everything ordered has arrived |

Receive the balance later against the same purchase order and it closes.

---

## Stage 5 — How inventory updates

**Inventory** (the main list)

Accepting a receipt writes one entry to the stock ledger, and the ledger is the
only thing that ever changes stock. Nothing else can edit a quantity directly —
which is what makes the numbers trustworthy.

Each entry records the item, the batch, the location, the quantity, the cost
applied, who did it and why. The stock figure you see is the running total of
those entries.

**What updates, in one receipt:**

| | Before | After receiving 6 boxes @ KES 1,200 |
| --- | --- | --- |
| Quantity on hand | 0 pairs | **600 pairs** |
| Unit cost | — | **KES 12.00 per pair** |
| Stock value | KES 0 | **KES 7,200** |
| Purchase order | Pending | **Completed** |
| Supplier invoice | — | **KES 7,200, pending payment** |

The conversion happens exactly once, here:

```
  quantity received  6 Box
  pack size          1 Box = 100 pairs
                     ------------------
  stock              6 x 100  = 600 pairs
  unit cost          1200/100 = KES 12.00 per pair
```

### Cost is a weighted average

Buy 100 pairs at KES 10, then 100 more at KES 14, and the cost becomes KES 12 —
not KES 14. Stock value, margin and cost of sales all follow from the ledger
rather than from the latest invoice, so a one-off expensive purchase does not
distort the value of everything on the shelf.

Every movement stores the cost that applied at the time, so history stays true
even after prices change.

### Stock leaves the same way it arrives

Every reduction is a ledger entry too, with a reason:

| Reason | When |
| --- | --- |
| Sale / dispense to patient | Pharmacy dispensing, billing |
| Internal consumption | A syringe used taking a blood sample; a reagent used running a test |
| Transfer out / in | Moving stock between departments |
| Wastage / breakage | Damaged goods |
| Expiry write-off | Time-expired stock |
| Stock take adjustment | Correcting a count, with a reason attached |
| Return to supplier | Goods sent back |

Issues take the **earliest-expiring batch first**, and skip expired batches, so
short-dated stock is used before it is lost.

---

## Full worked example

Examination Gloves, counted in **pairs**, bought in **boxes of 100**.

| Stage | What is entered | What the system records |
| --- | --- | --- |
| Create item | Name, category `Lab Consumable`, base unit `pairs` | Item, stock-tracked |
| Pack size | `Box`, holds 100 | 1 Box = 100 pairs |
| Requisition | 6, "Order in" = `Box` | `RAD/26/09/06/7455` — 6 Box (600 pairs) |
| Approve | Approve 6 | Status: Procurement approved |
| Generate PO | — | `PO/26/09/06/6753` — 6 Box, status Pending |
| Receive | 6 boxes @ KES 1,200, invoice `INV-4471` | GRN raised, invoice KES 7,200 |
| **Stock** | — | **600 pairs @ KES 12.00 — value KES 7,200** |
| PO now | — | Status: Completed |
| Dispense 3 pairs | — | Ledger entry −3 → **597 pairs** |

**If only 2 boxes had arrived:**

| | |
| --- | --- |
| Stock | 200 pairs @ KES 12.00 |
| Invoice | KES 2,400 |
| Purchase order | **Partial** — 4 boxes outstanding |

---

## What the system will not let you do

These are deliberate. Each one exists because the alternative silently corrupts
stock or accounts.

| Blocked | Why |
| --- | --- |
| Receiving a service item into stock | A Lab Test is billed, not held |
| Requisitioning a service item | Caught here rather than after the paperwork exists |
| Naming a pack the same as the base unit | "1 Kit = 500 kits" is meaningless |
| A pack that holds 1 | That is the base unit, not a pack |
| Using one item's pack on another item | A Box of 12 syringes cannot receive gauze |
| Editing a receipt already posted to the ledger | Post an adjustment or a return instead — history is not rewritten |
| Recording the same supplier invoice twice | Duplicate payment risk |
| Cancelling a requisition whose lines are on order | Deal with the purchase order first |
| Changing a quantity directly | Every change is a ledger entry with a reason and an author |

---

## Where each screen lives

| Task | Where |
| --- | --- |
| See stock on hand, value, short expiries | **Inventory** |
| Create or edit an item | **Inventory → Items** |
| Add pack sizes | **Inventory → Items →** row menu **→ Pack Sizes** |
| Raise a requisition | **Inventory → Create Requisition** |
| Department approval | **Inventory → Requisitions** |
| Procurement approval, generate an LPO | **Finance → Accounts Payable → Purchase Orders** |
| Receive a delivery | **Finance → Accounts Payable → Receive Items** |
| Every stock movement, with reasons | **Inventory → Stock Movements** |
| Supplier invoices and payments | **Finance → Accounts Payable** |

---

## Related documents

- `INVENTORY_UNITS_OF_MEASURE.md` — the technical detail behind units, packs
  and conversions, including which field is stored in which unit.
- `LAB_REAGENTS_SETUP.md` — **out of date.** Predates the stock-ledger rewrite
  and still refers to models that no longer exist.
