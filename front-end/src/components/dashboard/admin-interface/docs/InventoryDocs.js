import React from 'react'

const Section = ({ title, children }) => (
  <div className='mb-6'>
    <h3 className='text-lg font-semibold text-primary mb-2'>{title}</h3>
    <div className='text-sm text-gray-700 space-y-2'>{children}</div>
  </div>
)

const Code = ({ children }) => (
  <span className='bg-gray-100 text-xs px-1.5 py-0.5 rounded font-mono'>{children}</span>
)

const Table = ({ headers, rows }) => (
  <div className='overflow-x-auto'>
    <table className='min-w-full text-xs border border-gray-200 rounded'>
      <thead>
        <tr className='bg-gray-50'>
          {headers.map((h, i) => (
            <th key={i} className='text-left px-3 py-2 font-semibold border-b'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            {row.map((cell, j) => (
              <td key={j} className='px-3 py-2 border-b'>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const InventoryDocs = () => {
  return (
    <div className='max-w-4xl'>
      <h2 className='text-xl font-bold mb-4'>Inventory & Pack System</h2>

      <Section title='What are Packed and Subpacked?'>
        <p>
          Every item in the system has two pack properties:
        </p>
        <Table
          headers={['Property', 'Meaning', 'Example']}
          rows={[
            ['packed', 'Number of boxes/packs per shipment unit', '1 carton = 1 packed'],
            ['subpacked', 'Number of base units per box', '1 box of 20 syringes = subpacked is 20'],
          ]}
        />
        <p className='mt-2'>
          <strong>Base unit</strong> is the subpacked value. All stock quantities throughout the system (<Code>quantity_at_hand</Code>) are stored in base units.
        </p>
      </Section>

      <Section title='Example: Syringes'>
        <Table
          headers={['Field', 'Value', 'Meaning']}
          rows={[
            ['packed', '1', '1 box per shipment'],
            ['subpacked', '20', '20 syringes per box'],
            ['quantity_at_hand', '60', '60 individual syringes in stock'],
            ['Display', '60 units (3 packs of 20)', 'What staff sees on the inventory screen'],
          ]}
        />
      </Section>

      <Section title='Receiving Stock'>
        <p>
          When receiving items via <strong>Incoming Items</strong>, staff can choose a <Code>quantity_unit</Code>:
        </p>
        <Table
          headers={['Quantity Unit', 'What Staff Enters', 'System Converts To']}
          rows={[
            ['Packs', 'Number of boxes received', 'quantity x subpacked = base units added to stock'],
            ['Units (default)', 'Exact base units received', 'Added to stock as-is'],
          ]}
        />
        <div className='bg-blue-50 border-l-4 border-blue-400 p-3 rounded mt-2'>
          <p className='font-semibold text-blue-800'>Example</p>
          <p>
            Item: Paracetamol (subpacked = 10 tablets per strip).<br />
            Staff receives 5 packs and selects <Code>quantity_unit = packs</Code>.<br />
            System adds <strong>5 x 10 = 50 base units</strong> to inventory.
          </p>
        </div>
      </Section>

      <Section title='Inventory Display'>
        <p>
          The inventory grid shows both <strong>Lot Quantity</strong> and <strong>Total Quantity</strong> with a pack breakdown:
        </p>
        <ul className='list-disc pl-5 space-y-1'>
          <li><Code>60 units (3 packs of 20)</Code> — item fully divides into packs</li>
          <li><Code>65 units (3 packs of 20 + 5 loose)</Code> — has leftover loose units</li>
          <li><Code>42 units</Code> — subpacked is 1, so no pack breakdown shown</li>
        </ul>
      </Section>

      <Section title='How stock is recorded'>
        <p>
          Stock is <strong>not</strong> a number anyone edits. Every change is a row
          appended to the stock ledger (<Code>StockMovement</Code>), and the quantity you
          see on the inventory screen is the running total of those rows.
        </p>
        <Table
          headers={['Concept', 'What it is']}
          rows={[
            ['StockLot', 'The identity of a batch: item + lot number + expiry date'],
            ['StockMovement', 'The ledger. Append-only: never edited, never deleted'],
            ['StockBalance', 'A cache of the ledger, one row per item / lot / location'],
            ['StockPolicy', 'Re-order level and reorder quantity, per item per location'],
            ['StockReservation', 'Stock promised but not yet issued (e.g. prescribed, not dispensed)'],
            ['StockTake', 'A physical count; posting it writes the variance as an adjustment'],
          ]}
        />
        <p className='mt-2'>
          Because the ledger is the source of truth, the balances can always be rebuilt
          from it with <Code>manage.py rebuild_stock_balances</Code>. Any drift means
          something wrote stock outside the service layer.
        </p>
      </Section>

      <Section title='Movement types'>
        <Table
          headers={['Type', 'Direction', 'When it happens']}
          rows={[
            ['OPENING_BALANCE', 'In', 'Stock entered manually when setting up'],
            ['RECEIPT', 'In', 'Goods received against a purchase order'],
            ['SALE', 'Out', 'An invoice line is marked billed'],
            ['CONSUMPTION', 'Out', 'Reagents or consumables used running a test'],
            ['TRANSFER_OUT / TRANSFER_IN', 'Out then in', 'Stock moved between departments'],
            ['ADJUSTMENT', 'Either', 'Variance found by a stock take'],
            ['WASTAGE', 'Out', 'Breakage or spoilage'],
            ['EXPIRY_WRITE_OFF', 'Out', 'A lot passed its expiry date'],
            ['RETURN_TO_SUPPLIER', 'Out', 'Goods sent back'],
            ['REVERSAL', 'Either', 'Contra entry undoing an earlier movement'],
          ]}
        />
      </Section>

      <Section title='Correcting a mistake'>
        <p>
          A movement is a fact that happened, so it is never edited or deleted. To undo
          one, post a <strong>reversal</strong> — a contra entry that cancels it and leaves
          both rows visible. Use a <strong>stock adjustment</strong> for a correction with
          no original movement to point at, and a <strong>stock take</strong> when a
          physical count disagrees with the system.
        </p>
      </Section>

      <Section title='How stock leaves'>
        <p>
          Issues allocate <strong>FEFO</strong> (first expiry, first out) across lots at
          the dispensing location. Expired lots are skipped, and stock already reserved for
          someone else does not count as available. Each issue records the cost of the lot
          it drew from, so cost of goods sold is a sum over the ledger rather than an
          estimate.
        </p>
      </Section>

      <Section title='Stock Metrics'>
        <Table
          headers={['Metric', 'What It Means']}
          rows={[
            ['Short Expiries', 'Lots expiring within 90 days'],
            ['Re-order Levels', 'Items whose total at a location is at or below its StockPolicy level'],
            ['Total Value', 'Sum of (weighted-average unit cost x quantity) across all lots'],
          ]}
        />
        <p className='mt-2'>
          Re-order level belongs to an <strong>item at a location</strong>, never to an
          individual lot — three lots of five tablets each is fifteen tablets, not three
          separate shortages.
        </p>
      </Section>

      <Section title='Prices'>
        <p>
          Sale price is not stored on the stock row. It lives on an effective-dated price
          list (<Code>ItemPrice</Code>), with per-insurer overrides in{' '}
          <Code>InsuranceItemSalePrice</Code>. Receiving goods at a new cost therefore
          never silently revalues stock already on the shelf, and an invoice raised last
          month keeps last month&apos;s price.
        </p>
      </Section>

      <Section title='Key Rules'>
        <ul className='list-disc pl-5 space-y-1'>
          <li><strong>All quantities are in base units</strong> — never in packs. Packs are only a display/input convenience.</li>
          <li>Stock is tracked per lot (<Code>lot_number</Code> + <Code>expiry_date</Code>) per location.</li>
          <li>A lot that reaches zero keeps its history. Nothing is archived away or deleted.</li>
          <li>Services (lab tests, appointments) are billable but hold no stock at all.</li>
          <li>Departments hold their own stock; moving it between them is a transfer, recorded as two balanced ledger entries.</li>
        </ul>
      </Section>
    </div>
  )
}

export default InventoryDocs
