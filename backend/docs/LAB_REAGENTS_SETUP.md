# Lab Reagents and Consumables

How the lab's stock is set up and how it is consumed: reagents used running a
test, and consumables used collecting a sample.

> **This document was rewritten after the stock-ledger migration.** The earlier
> version described an `Inventory` table and a `TestKitCounter` table, neither
> of which exists any more. If you are following instructions that mention
> either, or the `ensure_service_inventory` command, they are out of date — see
> [What changed](#what-changed) at the end.

---

## The two things the lab consumes

They are deliberately separate, because they are consumed at different moments
and in different proportions.

| | **Reagent** | **Consumable (accompaniment)** |
| --- | --- | --- |
| Model | `TestPanelReagent` | `inventory.ItemConsumable` |
| Links | Test panel → reagent item | **Any billable item** → consumable item |
| Consumed | Once **per test run** | Once **per unit billed** |
| Example | Running an ALT test uses 1 test's worth of Roche ALT/AST reagent | A urea test uses 1 syringe, 1 swab and 1 EDTA tube; a paracetamol **injection** uses 1 syringe and 1 swab |
| Item category | `LabReagent` | `category_one = Internal (Consumable)` |
| Triggered by | The panel being **billed** | The item being **billed** |
| Blocks billing? | No — a shortfall is logged | **Yes**, when the link is marked required |

Consumables are not a lab-only idea, which is why they live on the item in the
inventory app rather than on the specimen in the laboratory app. An injectable
drug needs a syringe and a swab whether the injection is given in the ward or
at the patient's home; a tablet needs nothing. Declaring that on the item is
what lets one rule cover both a lab test and a drug.

---

## Setting up a reagent

A reagent is an ordinary inventory item. Nothing about it is special except its
category and what it is linked to.

### 1. Create the item

**Inventory → Items → Add New Item**

| Field | Value |
| --- | --- |
| Name | `Sysmex CBC Reagent Kit` |
| Category | `Lab Reagent` |
| Base Unit | `tests` |
| Departments | `Lab` |

**The base unit is `tests`, not `kits`.** This is the single most important
choice on the form. Stock is counted in the thing you actually consume — one
test run consumes one test — so the ledger can answer "how many more CBCs can
we run?" directly.

> The system rejects a pack named the same as the base unit. An item counted in
> `kits` with a `Kit` pack would print "1 Kit = 500 kits", which is meaningless.

### 2. Add the pack you buy in

**Inventory → Items →** row menu **→ Pack Sizes**

| Pack | Holds |
| --- | --- |
| `Kit` | 500 |

One kit is 500 tests. You purchase and receive in `Kit`; the ledger stores
tests. Buying 2 kits at KES 15,000 each gives **1,000 tests at KES 30 each** —
which is exactly what the demo data holds.

> **Watch the unit on prices.** `purchase_price` when receiving is the price of
> **one pack** (per kit) and the ledger divides it down. The cash sale price
> (`ItemPrice.sale_price`) is **per base unit** — per test. Entering a per-kit
> figure there overstates the price by the pack factor: a kit of 500 priced at
> KES 18,000 would charge KES 18,000 for a single test.

### 3. Link it to the panels that use it

**Laboratory → Lab Settings → Test Panels →** row menu **→ Reagents**

`TestPanelReagent` carries `units_consumed_per_run` — how many base units one
run of that panel consumes. Usually 1, but a panel that burns two tests' worth
of reagent says `2`.

A panel can link to several reagents, and one reagent can serve several panels:

```
  Complete Blood Count  ─┐
  Haemoglobin           ─┼─►  Sysmex CBC Reagent Kit   (1 test per run)
  White Cell Count      ─┘

  ALT  ─┬─►  Roche ALT/AST Reagent   (1 test per run)
  AST  ─┘
```

### 4. Optional: chemistry metadata

`LabReagent` holds CAS number, molecular weight and purity for a reagent item.
It is reference data only — **it plays no part in stock tracking**.

---

## Setting up consumables (accompaniments)

**Inventory → Items → Add New Item (or edit one) → Consumables (accompaniments)**

The consumable itself is an ordinary item with **Category** set to
`Internal (Consumable)` — only those can be picked as an accompaniment, since a
resale item is something the patient buys rather than something used up on
their behalf.

Then, on the item that needs them, list what it drags along. Each line is a
consumable, a quantity per use, and whether it is required:

| Item | Consumable | Qty per use | Required |
| --- | --- | --- | --- |
| Urea (lab test) | Syringe 5ml | 1 | yes |
| Urea (lab test) | Alcohol Swab | 1 | yes |
| Urea (lab test) | Blood Collection Tube EDTA | 1 | yes |
| Urea (lab test) | Cotton Wool | 1 | no |
| Paracetamol 1g **Injection** | Syringe 5ml | 1 | yes |
| Paracetamol 1g **Injection** | Alcohol Swab | 1 | yes |
| Paracetamol 500mg **Tablets** | *(none)* | | |
| Panadol 500mg Tablets | *(none)* | | |

**Required vs optional** is the whole of the difference: a required
accompaniment that is out of stock makes the item unbillable until inventory is
topped up; an optional one only warns.

Leaving the list empty is a real answer, not an unfinished one — it is how the
system tells "this needs nothing" apart from "this needs something we do not
have".

### Where it shows up

- **Sample collection** (Laboratory → Patient Samples) lists what the draw
  needs, with current stock, and flags anything short before the patient is in
  the chair.
- **Dispensing** (Pharmacy → prescribed drugs) sums the accompaniments across
  the selected drugs and warns when the selection cannot be billed.
- **Billing** refuses the line outright — see below.

### API

| Endpoint | Purpose |
| --- | --- |
| `GET /inventory/items/<id>/consumables/?quantity=&department=` | What this item needs, checked against live stock, plus `can_be_billed` |
| `GET/POST/PATCH/DELETE /inventory/item-consumables/` | The links on their own |
| `consumable_items` on `POST/PATCH /inventory/items/` | Declare them with the item; the posted list **replaces** the whole set |

---

## How consumption actually happens

### Reagents — on billing

When a `LabTestRequestPanel` is marked billed, `deduct_test_kit` posts a
`CONSUMPTION` movement for each linked reagent.

Billing is the trigger, not result entry, because that is the point at which
the test is committed to.

- **FEFO** — the earliest-expiring lot is used first, and expired lots are
  skipped.
- **Idempotent per (panel, reagent)** — the signal fires on every save of a
  billed panel; without this, editing a row would consume the reagent again.
- **Audited** — every consumption writes a `ReagentConsumptionLog` row with
  stock before and after, the patient, who performed it, and a reference tying
  it back to the stock movements.

### Consumables — on billing, and only there

Accompaniments leave stock at exactly one moment: when the item is billed, via
`billing.services.post_stock_for_invoice_item`, which calls
`inventory.services.consumables.consume`.

They used to be deducted a second time on sample collection. They are not any
more — one draw would otherwise take two syringes. Collection still *shows*
what is needed (`laboratory.serializers.sample_consumable_rows`);
`deduct_specimen_consumables` survives only as a no-op so a queued job does not
fail on deploy.

- **Checked first** — `billing.services.check_stock_available` runs before the
  invoice line is saved and **refuses it** when a required accompaniment cannot
  be covered at the dispensing department. The message names what is missing
  and how much of it there is.
- **Department-scoped** — availability is checked where the line is dispensed
  from (`source_tag`, else the item's category default). Syringes sitting in
  Lab do not unblock a Pharmacy dispense.
- **Idempotent per (invoice line, consumable)** — a re-saved line cannot take a
  second syringe.
- **Optional lines never block** — a shortfall on one is logged and the sale
  goes through.

Note that a **service** item — a lab test, an appointment — holds no stock of
its own but can still carry accompaniments, and the check runs for it either
way. That is what makes "Urea test needs a syringe" enforceable.

---

## Checking availability before running

`LabTestPanel` exposes two helpers, both reading the ledger:

| Method | Answers |
| --- | --- |
| `can_run()` | Is there enough of every linked reagent? Returns `(ok, message)` |
| `available_runs()` | How many more times can this panel run? Bottlenecked by the scarcest reagent |

Both exclude expired lots and stock already reserved for other work, so they
answer "can we actually do this now", not "what does the catalogue say".

### Low-stock threshold

A reagent counts as low when availability drops to its **re-order level**,
which lives on `StockPolicy` per item per department — the same place every
other re-order level in the system lives. There is no separate reagent
threshold to maintain.

Reagent availability is served at `/lab/testkitcounters/`, kept at its
historic route so the lab dashboard keeps working. There is no counter table
behind it; the number is computed from the ledger and cannot drift from actual
stock.

---

## Demo data

`create_real_world_lab_data()` builds a curated set of named profiles and
reagent kits — CBC, LFT, Lipid, Kidney Function, Thyroid, Electrolytes and
Glucose — each with its panels, its reagent kits priced and stocked through the
ledger, reference values and interpretations.

```bash
# Everything: users, departments, suppliers, items, lab data
docker exec -it easymed-backend python manage.py generate_dummy_data

# Give every service item (lab tests, appointments) a cash price
docker exec -it easymed-backend python manage.py ensure_service_prices
```

Counts are deliberately not quoted here. The generator also creates randomised
items, so the totals in the database are larger than the curated set and drift
between runs — query them rather than trusting a number in a document.

> Opening stock for reagents is posted **through the ledger** as a real
> receipt, the same way live stock arrives. There is no path that writes a
> quantity directly.

---

## Verification

```python
# Reagent availability, in tests
from inventory.models import Item
from laboratory.utils import reagent_stock

for reagent in Item.objects.filter(category='LabReagent'):
    row = reagent_stock(reagent)
    print(f"{row['reagent_name']}: {row['available_tests']} tests "
          f"(status: {row['stock_status']})")
```

```python
# Which reagent each panel consumes, and how much
from laboratory.models import TestPanelReagent

for link in TestPanelReagent.objects.select_related('test_panel', 'reagent_item'):
    print(f"{link.test_panel.name} -> {link.reagent_item.name} "
          f"x{link.units_consumed_per_run}")
```

```python
# What an item drags along
from inventory.models import ItemConsumable

for link in ItemConsumable.objects.select_related('item', 'consumable'):
    print(link)          # "Urea needs 1 x Syringe 5ml"
```

```python
# Can this be billed right now, and what is missing if not?
from inventory.models import Department, Item
from inventory.services import consumables

item = Item.objects.get(name='Paracetamol 1g Injection')
pharmacy = Department.objects.get(name='Pharmacy')

print(consumables.availability(item, quantity=2, department=pharmacy))
print(consumables.check_available(item, 2, pharmacy))   # (True, '')
```

```python
# Can we run this panel right now, and how many times?
from laboratory.models import LabTestPanel

panel = LabTestPanel.objects.get(name='ALT')
print(panel.can_run())          # (True, 'OK')
print(panel.available_runs())   # 400
```

```python
# Audit trail for reagent consumption
from laboratory.models import ReagentConsumptionLog

for log in ReagentConsumptionLog.objects.select_related('reagent_item')[:10]:
    print(f"{log.consumed_at:%Y-%m-%d} {log.reagent_item.name}: "
          f"{log.available_tests_before} -> {log.available_tests_after} "
          f"({log.patient_name})")
```

---

## Troubleshooting

**A reagent shows zero stock.** It was never received. Reagent stock arrives
the same way all stock does — through a goods receipt, or an opening-stock
entry. Check `Inventory → Stock Movements` filtered to the item; if there are
no `RECEIPT` rows, nothing was ever posted.

**A test ran but no reagent was deducted.** Either the panel has no
`TestPanelReagent` link, or the panel was never marked billed. The task logs
`"No reagents configured for test panel: <name>"` in the first case.

**Collecting a sample deducted nothing.** The specimen has no consumables
configured. Open **Lab Settings → Specimens**, edit the specimen, and add them.
The form says explicitly when a specimen has none.

**Stock went negative.** Balances are deliberately signed so drift is visible
rather than being hidden by a constraint failure. Investigate with the stock
card for that item, then correct with a stock adjustment — which records a
reason and an author.

**Availability looks wrong after a manual database change.** Rebuild the
derived balances from the movements:

```bash
docker exec -it easymed-backend python manage.py rebuild_stock_balances
```

---

## Where the code lives

| Concern | Location |
| --- | --- |
| Panel → reagent link | `laboratory/models.py` — `TestPanelReagent` |
| Item → consumable link | `inventory/models.py` — `ItemConsumable` |
| Requirements, availability, consumption | `inventory/services/consumables.py` |
| The billing block | `billing/services.py` — `check_stock_available` |
| Consumption tasks | `laboratory/tasks.py` — `deduct_test_kit` |
| What triggers them | `laboratory/signals.py` |
| Availability, thresholds | `laboratory/utils.py` — `reagent_stock`, `reagent_threshold` |
| Pre-run checks | `LabTestPanel.can_run()`, `LabTestPanel.available_runs()` |
| The only writer of stock | `inventory/services/stock.py` |
| Audit trail | `laboratory/models.py` — `ReagentConsumptionLog` |
| Demo data | `customuser/management/utils/data_generators.py` — `create_real_world_lab_data()` |

---

## What changed

The original version of this document described a design that no longer exists.
Recorded here so anyone following older instructions can see why they fail.

| Then | Now |
| --- | --- |
| `Inventory` table held a quantity column | `StockMovement` ledger, with `StockBalance` as a derived cache |
| `TestKitCounter` tracked available tests | Availability computed from the ledger; no counter table |
| Counter decremented when a test ran | `CONSUMPTION` movement posted when the panel is billed, idempotently |
| Threshold on the counter row | Re-order level on `StockPolicy`, per item per department |
| `Inventory.sale_price` | `ItemPrice`, effective-dated so old invoices keep old prices |
| Reagents stocked in **kits** | Stocked in **tests**; `Kit` is a pack size of N tests |
| `ensure_service_inventory` created fake stock rows so billing could find a price | `ensure_service_prices` sets a price; service items hold no stock at all |
| No concept of collection consumables | `SpecimenConsumable`, deducted once per sample collected |
| `SpecimenConsumable` — lab only, per specimen, never blocked anything | `inventory.ItemConsumable` — any billable item, deducted once at billing, **blocks billing** when a required one is out of stock. Old rows were migrated onto the lab-test items in `laboratory/migrations/0024`. |

The old "Total Demo Value / Potential Profit" summary has been dropped rather
than corrected. It was arithmetic over a reagent list that has since changed,
it ignored the cost of the reagent it was selling, and nothing in the codebase
produced or checked those figures.

**See also:** `INVENTORY_FLOW.md` for the end-to-end purchasing flow, and
`INVENTORY_UNITS_OF_MEASURE.md` for how units and pack sizes work.
