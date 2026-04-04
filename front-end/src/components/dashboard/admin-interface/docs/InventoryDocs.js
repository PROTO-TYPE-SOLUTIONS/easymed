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

      <Section title='Stock Metrics'>
        <Table
          headers={['Metric', 'What It Means']}
          rows={[
            ['Short Expiries', 'Items expiring within 90 days'],
            ['Re-order Levels', 'Items where quantity_at_hand is at or below re_order_level'],
            ['Total Value', 'Sum of (purchase_price x quantity_at_hand) across all lots'],
          ]}
        />
      </Section>

      <Section title='Key Rules'>
        <ul className='list-disc pl-5 space-y-1'>
          <li><strong>All quantities are in base units</strong> — never in packs. Packs are only a display/input convenience.</li>
          <li>Stock is tracked per lot (<Code>lot_number</Code> + <Code>expiry_date</Code>). The same item can have multiple inventory records if it arrives in different lots.</li>
          <li>When stock hits zero, the inventory record can be moved to <Code>InventoryArchive</Code>.</li>
          <li>Departments can hold their own stock via <Code>DepartmentInventory</Code>, transferred from the main inventory.</li>
        </ul>
      </Section>
    </div>
  )
}

export default InventoryDocs
