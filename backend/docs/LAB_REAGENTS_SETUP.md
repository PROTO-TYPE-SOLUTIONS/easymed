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

| | **Reagent** | **Consumable** |
| --- | --- | --- |
| Model | `TestPanelReagent` | `SpecimenConsumable` |
| Links | Test panel → reagent item | Specimen type → consumable item |
| Consumed | Once **per test run** | Once **per sample collection** |
| Example | Running an ALT test uses 1 test's worth of Roche ALT/AST reagent | Drawing blood uses 1 syringe and 1 EDTA tube |
| Item category | `LabReagent` | `LabConsumable` |
| Triggered by | The panel being **billed** | The sample being marked **collected** |

The distinction matters: **one blood draw serves every blood panel on the
request**. Ordering six blood tests consumes six tests' worth of reagent but
still only one syringe and one tube. Tying consumables to the specimen rather
than the panel is what gets that right.

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

## Setting up specimen consumables

**Laboratory → Lab Settings → Specimens**

Add or edit a specimen and list what collecting it uses up. Each line is an
item of category `Lab Consumable` and a quantity per collection:

| Specimen | Consumable | Qty per collection |
| --- | --- | --- |
| Blood | Syringe 5ml | 1 |
| Blood | EDTA Tube | 1 |
| Urine | Sample Container | 1 |

The form shows current stock beside each line and flags anything below what a
collection needs, so a shortage is visible before a patient is in the chair.

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

### Consumables — on collection

When a `PatientSample` is marked collected, `deduct_specimen_consumables` posts
a `CONSUMPTION` movement for each consumable linked to that specimen type.

- **Idempotent per (sample, consumable)** — re-saving a collected sample does
  not consume a second tube.
- **Partial issue allowed** — if stock is short the shortfall is logged rather
  than blocking the collection. Clinical work is not held up by a stock
  discrepancy; the gap shows in the ledger instead.

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
# What a sample collection consumes
from laboratory.models import SpecimenConsumable

for link in SpecimenConsumable.objects.select_related('specimen', 'item'):
    print(link)          # "Blood uses 1 x Syringe 5ml"
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
| Specimen → consumable link | `laboratory/models.py` — `SpecimenConsumable` |
| Consumption tasks | `laboratory/tasks.py` — `deduct_test_kit`, `deduct_specimen_consumables` |
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

The old "Total Demo Value / Potential Profit" summary has been dropped rather
than corrected. It was arithmetic over a reagent list that has since changed,
it ignored the cost of the reagent it was selling, and nothing in the codebase
produced or checked those figures.

**See also:** `INVENTORY_FLOW.md` for the end-to-end purchasing flow, and
`INVENTORY_UNITS_OF_MEASURE.md` for how units and pack sizes work.
