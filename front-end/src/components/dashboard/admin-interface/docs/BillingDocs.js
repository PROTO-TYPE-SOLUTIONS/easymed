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

const BillingDocs = () => {
  return (
    <div className='max-w-4xl'>
      <h2 className='text-xl font-bold mb-4'>Billing & Invoices</h2>

      <Section title='Invoice Structure'>
        <p>Billing follows a two-level structure:</p>
        <Table
          headers={['Level', 'Model', 'Purpose']}
          rows={[
            ['Invoice', 'Invoice', 'Top-level record per patient visit. Contains invoice number, patient, status.'],
            ['Invoice Item', 'InvoiceItem', 'Individual line item: a drug, lab test, appointment, or service.'],
          ]}
        />
      </Section>

      <Section title='Invoice Items and Quantity'>
        <p>
          Each invoice item has a <Code>quantity</Code> field (default: 1). The pricing works as follows:
        </p>
        <Table
          headers={['Field', 'Meaning']}
          rows={[
            ['sale_price', 'Per-unit price of the item (from Inventory or InsuranceItemSalePrice)'],
            ['quantity', 'Number of units being billed'],
            ['item_amount', 'Total = sale_price x quantity'],
            ['actual_total', 'What the patient actually pays (co-pay for insured, or full amount for cash)'],
          ]}
        />
        <div className='bg-blue-50 border-l-4 border-blue-400 p-3 rounded mt-2'>
          <p className='font-semibold text-blue-800'>Example</p>
          <p>
            Paracetamol: sale_price = 50, quantity = 3<br />
            item_amount = 150 (50 x 3)<br />
            If patient has insurance with co-pay of 20 per unit: actual_total = 60 (20 x 3)
          </p>
        </div>
      </Section>

      <Section title='Pricing Sources'>
        <p>
          When an invoice item is created, the system determines the price in this order:
        </p>
        <ol className='list-decimal pl-5 space-y-1'>
          <li>
            <strong>Insurance price</strong> — If the patient has active insurance, the system looks up
            <Code>InsuranceItemSalePrice</Code> for the specific item + insurance company. Uses the insurance
            <Code>sale_price</Code> and <Code>co_pay</Code>.
          </li>
          <li>
            <strong>Inventory price</strong> — Falls back to the <Code>sale_price</Code> from the item&apos;s
            active inventory record. The patient pays the full amount.
          </li>
        </ol>
      </Section>

      <Section title='Payment Modes'>
        <p>Each invoice item can be paid through different modes:</p>
        <Table
          headers={['Mode', 'Description']}
          rows={[
            ['Cash', 'Default. Patient pays directly.'],
            ['Mobile Money (M-Pesa)', 'Patient pays via mobile money.'],
            ['Insurance', 'Billed to the patient\'s insurance company. Patient pays the co-pay portion.'],
          ]}
        />
        <p>
          For prescribed drugs, staff can select the payment mode per item when generating the invoice.
        </p>
      </Section>

      <Section title='Billing Lab Tests'>
        <p>When a lab test is billed:</p>
        <ol className='list-decimal pl-5 space-y-1'>
          <li>An invoice item is created using the test panel&apos;s <Code>Lab Test</Code> billing item</li>
          <li>The <Code>sale_price</Code> comes from the billing item&apos;s inventory record or insurance price</li>
          <li>Setting <Code>is_billed = true</Code> on the LabTestRequestPanel triggers reagent deduction in the background</li>
          <li>Reagent stock is deducted from inventory (see Lab Tests & Reagents section for details)</li>
        </ol>
      </Section>

      <Section title='Billing Prescribed Drugs'>
        <p>When billing drugs from a prescription:</p>
        <ol className='list-decimal pl-5 space-y-1'>
          <li>Staff selects which prescribed drugs to include on the invoice</li>
          <li>For each drug, staff can adjust the <Code>quantity</Code> and select a payment mode</li>
          <li>The total per drug is calculated as <Code>sale_price x quantity</Code></li>
          <li>A grand total is shown at the bottom of the drug list</li>
        </ol>
      </Section>

      <Section title='Viewing Invoice Items'>
        <p>
          The invoice items view shows all line items for a given invoice with these columns:
        </p>
        <Table
          headers={['Column', 'Source']}
          rows={[
            ['Code', 'item_code — the item\'s product code'],
            ['Item', 'item_name — the product or service name'],
            ['Qty', 'quantity — number of units billed'],
            ['Unit Price', 'sale_price — per-unit price'],
            ['Payment Mode', 'payment_mode_name — cash, insurance, etc.'],
            ['Total Amount', 'item_amount — sale_price x quantity'],
            ['Co Pay', 'item_amount - actual_total (what insurance covers)'],
            ['Status', 'status — pending, paid, etc.'],
          ]}
        />
      </Section>

      <Section title='Key Rules'>
        <ul className='list-disc pl-5 space-y-1'>
          <li>
            <Code>sale_price</Code> is always the <strong>per-unit price</strong>.
            Total amounts are computed as <Code>sale_price x quantity</Code>.
          </li>
          <li>
            Default insurance prices are auto-created when a new inventory record is created,
            so billing items always have a price even if insurance rates haven&apos;t been explicitly configured.
          </li>
          <li>
            Invoices are linked to patient visits. One visit can have multiple invoices.
          </li>
        </ul>
      </Section>
    </div>
  )
}

export default BillingDocs
