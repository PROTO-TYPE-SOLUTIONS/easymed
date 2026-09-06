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

const LabDocs = () => {
  return (
    <div className='max-w-4xl'>
      <h2 className='text-xl font-bold mb-4'>Lab Tests & Reagents</h2>

      <Section title='How Lab Tests Are Structured'>
        <p>Lab tests are organized in a three-level hierarchy:</p>
        <Table
          headers={['Level', 'Model', 'Example']}
          rows={[
            ['Profile', 'LabTestProfile', '"Liver Function Tests", "CBC", "Renal Panel"'],
            ['Panel', 'LabTestPanel', '"ALT", "AST", "Albumin", "Bilirubin"'],
            ['Reagent Link', 'TestPanelReagent', '"Albumin uses Albumin Reagent Kit (1 unit per run)"'],
          ]}
        />
        <div className='bg-gray-50 p-3 rounded mt-2 font-mono text-xs'>
          LabTestProfile (Liver Function Tests)<br />
          &nbsp;&nbsp;|-- LabTestPanel (ALT)<br />
          &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;|-- TestPanelReagent: ALT Reagent Kit (1 unit/run)<br />
          &nbsp;&nbsp;|-- LabTestPanel (Albumin)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- TestPanelReagent: Albumin Reagent Kit (1 unit/run)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- TestPanelReagent: Buffer Solution (2 units/run)
        </div>
      </Section>

      <Section title='Reagents and Inventory'>
        <p>
          A <strong>reagent</strong> is an inventory item with category <Code>LabReagent</Code>. It lives in the same inventory system as drugs, surgical equipment, etc.
        </p>
        <Table
          headers={['Concept', 'Where It Lives', 'Purpose']}
          rows={[
            ['Reagent stock', 'Stock ledger (StockMovement)', 'Base units in stock, derived from the ledger rather than a separate counter'],
            ['Low-stock threshold', 'StockPolicy (per item, per location)', 'When to warn that a reagent is running out'],
            ['Reagent metadata', 'LabReagent model', 'Chemistry info: CAS number, molecular weight, purity (optional)'],
            ['Reagent-to-test link', 'TestPanelReagent', 'Which reagents a test panel needs and how many units per run'],
            ['Billing item', 'Item (category="Lab Test")', 'Auto-created paired item used for billing patients'],
          ]}
        />
        <div className='bg-blue-50 border-l-4 border-blue-400 p-3 rounded mt-2'>
          <p className='font-semibold text-blue-800'>Auto-created billing items</p>
          <p>
            When you create a <Code>LabReagent</Code> inventory item, the system automatically creates a
            paired <Code>Lab Test</Code> billing item. This billing item is what gets attached to the
            test panel and appears on patient invoices. You don&apos;t need to create it manually.
          </p>
        </div>
      </Section>

      <Section title='What Happens When a Test Runs'>
        <p>Here is the complete flow from doctor order to reagent deduction:</p>
        <ol className='list-decimal pl-5 space-y-2'>
          <li>
            <strong>Doctor orders a profile</strong> (e.g., &quot;Liver Function Tests&quot;)
            <br />
            <span className='text-gray-500'>A LabTestRequest is created, linked to the patient&apos;s visit.</span>
          </li>
          <li>
            <strong>System creates a LabTestRequestPanel for each panel</strong> in the profile
            <br />
            <span className='text-gray-500'>ALT, AST, Albumin, Bilirubin — each tracked individually. If a doctor orders only Albumin and Bilirubin, only those 2 panels are created.</span>
          </li>
          <li>
            <strong>Sample is collected</strong>
            <br />
            <span className='text-gray-500'>A PatientSample record is created (or reused if same specimen type).</span>
          </li>
          <li>
            <strong>Test is billed</strong> — <Code>is_billed = true</Code>
            <br />
            <span className='text-gray-500'>This triggers the reagent deduction process (via background task).</span>
          </li>
          <li>
            <strong>For each reagent linked to the panel:</strong>
            <ul className='list-disc pl-5 mt-1 space-y-1'>
              <li>Deduct <Code>units_consumed_per_run</Code> from <strong>Inventory</strong> using FEFO (First Expiry, First Out)</li>
              <li>The earliest-expiring lot is consumed first</li>
              <li>A <Code>ReagentConsumptionLog</Code> entry is created for audit</li>
            </ul>
          </li>
          <li>
            <strong>Results are entered and approved</strong>
            <br />
            <span className='text-gray-500'>Lab tech enters the result value, system auto-generates interpretation based on reference ranges.</span>
          </li>
        </ol>
      </Section>

      <Section title='Understanding units_consumed_per_run'>
        <p>
          This field on <Code>TestPanelReagent</Code> tells the system <strong>how many base inventory units</strong> of the reagent are consumed each time the test panel runs once.
        </p>
        <Table
          headers={['Reagent', 'Kit pack size', 'units_consumed_per_run', 'Meaning']}
          rows={[
            ['Albumin Reagent Kit', 'Kit = 200 tests', '1', '1 base unit per test = 200 tests per kit'],
            ['Buffer Solution', 'Bottle = 500 ml', '3', '3 ml consumed per test run'],
            ['CBC Reagent Pack', 'Pack = 100 tests', '1', '1 base unit per test = 100 tests per pack'],
          ]}
        />
        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mt-2'>
          <p className='font-semibold text-yellow-800'>Important</p>
          <p>
            This value is in <strong>base units</strong>, not in kits. If your reagent kit has 200 tests
            and each test uses 1 test from the kit, set <Code>units_consumed_per_run = 1</Code>.
          </p>
        </div>
      </Section>

      <Section title='FEFO Stock Deduction'>
        <p>
          When reagent stock is consumed, the system uses <strong>FEFO (First Expiry, First Out)</strong>:
        </p>
        <ul className='list-disc pl-5 space-y-1'>
          <li>Inventory lots are sorted by expiry date (earliest first)</li>
          <li>Stock is deducted from the earliest-expiring lot until the required amount is consumed</li>
          <li>If a lot doesn&apos;t have enough, the remainder is taken from the next lot</li>
          <li>This prevents expired reagents from sitting unused while fresher stock is consumed</li>
        </ul>
      </Section>

      <Section title='Availability Check'>
        <p>
          Before billing a test, the system can check whether all required reagents have sufficient stock:
        </p>
        <Table
          headers={['Method', 'What It Returns']}
          rows={[
            ['can_run()', 'true/false and a reason message — checks if stock is sufficient for one run'],
            ['available_runs()', 'Number — how many times the test can run with current stock (bottlenecked by scarcest reagent)'],
          ]}
        />
        <div className='bg-gray-50 p-3 rounded mt-2 font-mono text-xs'>
          Albumin Panel:<br />
          &nbsp;&nbsp;Reagent A: 150 units in stock, 1 unit/run = 150 runs<br />
          &nbsp;&nbsp;Reagent B: 30 units in stock, 3 units/run = 10 runs<br />
          &nbsp;&nbsp;<strong>available_runs() = 10</strong> (limited by Reagent B)
        </div>
      </Section>

      <Section title='Low Stock Alerts'>
        <p>
          The system monitors reagent stock levels and provides alerts:
        </p>
        <Table
          headers={['Status', 'Condition']}
          rows={[
            ['Out of Stock', 'Total inventory quantity is 0'],
            ['Low Stock', 'Total inventory quantity is at or below the minimum threshold (default: 10)'],
            ['In Stock', 'Above the minimum threshold'],
          ]}
        />
        <p>
          These alerts are visible on the <strong>Lab Dashboard</strong> and can be accessed via the
          <Code>low-stock-reagents</Code> API endpoint.
        </p>
      </Section>

      <Section title='Setting Up a New Lab Test'>
        <ol className='list-decimal pl-5 space-y-2'>
          <li>
            <strong>Create the reagent item</strong> in Inventory with category <Code>LabReagent</Code>,
            stocked in tests. Then open <strong>Pack Sizes</strong> on that item and add a
            <Code>Kit</Code> holding the number of tests per kit (e.g., 200).
            A <Code>Lab Test</Code> billing item is auto-created.
          </li>
          <li>
            <strong>Receive stock</strong> against a purchase order. Set <strong>Received in</strong>
            to the Kit when entering whole kits, or leave it on the base unit when entering
            individual test counts.
          </li>
          <li>
            <strong>Create a Test Profile</strong> (e.g., &quot;Liver Function Tests&quot;) if one doesn&apos;t exist.
          </li>
          <li>
            <strong>Create Test Panels</strong> under the profile (e.g., ALT, AST, Albumin).
            Assign the auto-created <Code>Lab Test</Code> billing item.
          </li>
          <li>
            <strong>Link reagents to panels</strong> via TestPanelReagent.
            Set <Code>units_consumed_per_run</Code> (usually 1 for standard reagent kits).
          </li>
          <li>
            <strong>Add reference values</strong> for each panel (by sex and age range).
          </li>
        </ol>
      </Section>
    </div>
  )
}

export default LabDocs
