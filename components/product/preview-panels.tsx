'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Circle,
  Clock3,
  MoveUpRight,
  ScanBarcode,
  Receipt,
  Store,
  Calendar,
  Wallet,
  FileText,
  MapPin,
  Truck,
  Wrench,
  Package,
  Layers,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/product/ui/button'
import { cn } from '@/lib/utils'

// ==================== CRM PANELS ====================
const pipeline = [
  {
    stage: 'New leads',
    id: 'new',
    count: 6,
    deals: [
      { company: 'Acme Industries', amount: '₹1,20,000', initials: 'RK', person: 'Riya Kapoor' },
      { company: 'Orbit Studio', amount: '₹85,000', initials: 'AM', person: 'Arjun Mehta' },
    ],
  },
  {
    stage: 'In progress',
    id: 'progress',
    count: 4,
    deals: [
      { company: 'Northstar Tech', amount: '₹2,40,000', initials: 'AS', person: 'Ananya Shah' },
      { company: 'The Good Co.', amount: '₹65,000', initials: 'RK', person: 'Riya Kapoor' },
    ],
  },
  {
    stage: 'Won',
    id: 'won',
    count: 8,
    deals: [
      { company: 'Brightleaf', amount: '₹96,000', initials: 'AM', person: 'Arjun Mehta' },
      { company: 'Form & Field', amount: '₹1,80,000', initials: 'AS', person: 'Ananya Shah' },
    ],
  },
]

export function PipelineBoard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="pipeline-grid">
      {pipeline.map((column) => (
        <div className="pipeline-column" key={column.id}>
          <div className="pb-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="pipeline-dot" data-stage={column.id} aria-hidden="true" />
              <span className="font-medium">{column.stage}</span>
              <span className="text-muted-foreground">{column.count}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {column.deals.slice(0, compact ? 1 : 2).map((deal) => (
              <div className="pipeline-deal" key={deal.company}>
                <div className="flex flex-col gap-2.5">
                  <span className="truncate text-sm font-semibold">{deal.company}</span>
                  <span className="text-sm text-muted-foreground">{deal.amount}</span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="preview-avatar" data-accent={column.id === 'progress'} title={deal.person}>
                      {deal.initials}
                    </span>
                    {column.id === 'won' ? (
                      <span className="flex items-center gap-1 text-sm"><Check className="size-4" /> Won</span>
                    ) : (
                      <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function OverviewPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="preview-heading">Good morning, Arjun</p>
          <p className="text-sm text-muted-foreground">A little clarity for your next big move.</p>
        </div>
        <span className="preview-avatar" data-accent="true" aria-label="Sample user: Arjun Mehta">AM</span>
      </div>
      <dl className="preview-stat-grid">
        {[
          { label: 'Total revenue', value: '₹12,84,000', change: '18.6%' },
          { label: 'Active deals', value: '48', change: '12.4%' },
          { label: 'Win rate', value: '68%', change: '8.2%' },
        ].map((stat) => (
          <div className="preview-stat" key={stat.label}>
            <div className="flex flex-col gap-2">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="preview-stat-value">{stat.value}</dd>
              <dd className="flex items-center gap-1 text-sm text-muted-foreground">
                <MoveUpRight className="size-4" aria-hidden="true" />
                {stat.change}
              </dd>
            </div>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-semibold">Your pipeline</span>
          <span className="text-muted-foreground">This month</span>
        </div>
        <PipelineBoard compact />
      </div>
    </div>
  )
}

export function DealsPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">Good things in the pipeline.</p>
        <p className="text-sm text-muted-foreground">Every opportunity. A clear next step.</p>
      </div>
      <PipelineBoard />
    </div>
  )
}

const contacts = [
  { name: 'Riya Kapoor', initials: 'RK', company: 'Acme Industries', status: 'Customer' },
  { name: 'Dev Patel', initials: 'DP', company: 'Northstar Tech', status: 'In conversation' },
  { name: 'Ananya Shah', initials: 'AS', company: 'Brightleaf', status: 'Customer' },
  { name: 'Kabir Rao', initials: 'KR', company: 'Orbit Studio', status: 'New lead' },
]

export function ContactsPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">People, not just records.</p>
        <p className="text-sm text-muted-foreground">The context you need, all in one place.</p>
      </div>
      <ul aria-label="Sample contacts">
        {contacts.map((contact, index) => (
          <li key={contact.name} className="preview-contact-row text-sm">
            <div className="flex items-center gap-2.5">
              <span className="preview-avatar" data-accent={index % 2 === 0}>{contact.initials}</span>
              <span className="truncate font-medium">{contact.name}</span>
            </div>
            <span className="contact-company truncate text-muted-foreground">{contact.company}</span>
            <span className="text-right text-muted-foreground">{contact.status}</span>
          </li>
        ))}
      </ul>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Check className="size-4" />Shared context. Better conversations.
      </p>
    </div>
  )
}

const sampleTasks = [
  { title: 'Discovery call with Northstar', company: 'Northstar Tech', time: '10:30 AM' },
  { title: 'Send the updated proposal', company: 'Acme Industries', time: '12:00 PM' },
  { title: 'Check in with Ananya', company: 'Brightleaf', time: '2:30 PM' },
  { title: 'Follow up on the next steps', company: 'Orbit Studio', time: '4:00 PM' },
]

export function TasksPanel() {
  const [completed, setCompleted] = useState<number[]>([1])
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">A good day starts here.</p>
        <p className="text-sm text-muted-foreground">Try checking off a task in this sample workspace.</p>
      </div>
      <ul className="flex flex-col gap-1">
        {sampleTasks.map((task, index) => (
          <li key={task.title} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center gap-2.5">
              <Button
                size="icon"
                variant="ghost"
                aria-label={`${completed.includes(index) ? 'Mark incomplete' : 'Complete'}: ${task.title}`}
                aria-pressed={completed.includes(index)}
                onClick={() => setCompleted((current) => current.includes(index) ? current.filter((id) => id !== index) : [...current, index])}
              >
                {completed.includes(index) ? <Check /> : <Circle />}
              </Button>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className={cn('truncate text-sm font-medium', completed.includes(index) && 'text-muted-foreground line-through')}>{task.title}</span>
                <span className="text-sm text-muted-foreground">{task.company}</span>
              </div>
              <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex"><Clock3 className="size-4" />{task.time}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {completed.length} of {sampleTasks.length} sample tasks complete.
      </p>
    </div>
  )
}

// ==================== POSS PANELS ====================
export function PossRegistersPanel() {
  const registers = [
    { name: 'Register 01 (Main Counter)', cashier: 'Kavita M.', status: 'Active', todaySales: '₹48,250', orders: 114 },
    { name: 'Register 02 (Express Checkout)', cashier: 'Rahul S.', status: 'Active', todaySales: '₹32,100', orders: 86 },
    { name: 'Register 03 (Drive/Back Office)', cashier: 'Pooja T.', status: 'Idle', todaySales: '₹14,800', orders: 28 },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="preview-heading">Counter Terminal Status</p>
          <p className="text-sm text-muted-foreground">Real-time sync across physical stores and registers.</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-full">3 ONLINE</span>
      </div>
      <div className="grid gap-3">
        {registers.map((reg) => (
          <div key={reg.name} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/40">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{reg.name}</span>
              <span className="text-xs text-muted-foreground">Cashier: {reg.cashier} • {reg.orders} tickets</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold">{reg.todaySales}</span>
              <span className="block text-xs text-primary font-mono">{reg.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PossOrdersPanel() {
  const orders = [
    { id: '#POS-9842', time: '14:22', items: 4, total: '₹2,450', mode: 'UPI' },
    { id: '#POS-9841', time: '14:18', items: 2, total: '₹890', mode: 'Cash' },
    { id: '#POS-9840', time: '14:15', items: 7, total: '₹5,120', mode: 'Card' },
    { id: '#POS-9839', time: '14:02', items: 1, total: '₹340', mode: 'UPI' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">Recent Checkout Receipts</p>
        <p className="text-sm text-muted-foreground">Instant billing with GST invoice generation.</p>
      </div>
      <ul className="flex flex-col gap-2">
        {orders.map((o) => (
          <li key={o.id} className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/20">
            <div className="flex items-center gap-3">
              <Receipt className="size-4 text-primary" />
              <div>
                <span className="text-sm font-mono font-bold">{o.id}</span>
                <span className="text-xs text-muted-foreground ml-2">{o.time} • {o.items} items</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 rounded bg-secondary font-mono">{o.mode}</span>
              <span className="text-sm font-semibold">{o.total}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PossInventoryPanel() {
  const items = [
    { sku: 'SKU-802', name: 'Almond Roast 500g', stock: 48, status: 'In Stock' },
    { sku: 'SKU-419', name: 'Cold Brew Concentrate 1L', stock: 12, status: 'Low Stock' },
    { sku: 'SKU-105', name: 'Ceramic Espresso Cup', stock: 94, status: 'In Stock' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">Live Store Inventory</p>
        <p className="text-sm text-muted-foreground">Barcode-ready product catalogue & auto re-order thresholds.</p>
      </div>
      <div className="grid gap-2">
        {items.map((it) => (
          <div key={it.sku} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/30">
            <div>
              <span className="text-xs font-mono text-muted-foreground">{it.sku}</span>
              <p className="text-sm font-medium">{it.name}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold">{it.stock} units</span>
              <span className={cn('block text-xs font-mono', it.stock < 20 ? 'text-amber-500' : 'text-primary')}>{it.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== HRMS PANELS ====================
export function HrmsDirectoryPanel() {
  const employees = [
    { name: 'Deepa Nair', role: 'Engineering Lead', dept: 'Tech', status: 'Present' },
    { name: 'Karan Sharma', role: 'Product Designer', dept: 'Design', status: 'Remote' },
    { name: 'Aakash Verma', role: 'Growth Strategist', dept: 'Marketing', status: 'Present' },
    { name: 'Sneha Rao', role: 'People Operations', dept: 'HR', status: 'On Leave' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="preview-heading">Team Roster</p>
          <p className="text-sm text-muted-foreground">Organization tree and department rosters.</p>
        </div>
        <span className="text-xs font-mono bg-secondary px-2.5 py-1 rounded-full">42 Members</span>
      </div>
      <div className="grid gap-2.5">
        {employees.map((emp) => (
          <div key={emp.name} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/40">
            <div className="flex items-center gap-3">
              <span className="preview-avatar font-mono text-xs">{emp.name.split(' ').map(n => n[0]).join('')}</span>
              <div>
                <p className="text-sm font-semibold">{emp.name}</p>
                <p className="text-xs text-muted-foreground">{emp.role} • {emp.dept}</p>
              </div>
            </div>
            <span className={cn('text-xs font-mono px-2 py-0.5 rounded', emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary')}>{emp.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HrmsAttendancePanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">Shift & Leave Summary</p>
        <p className="text-sm text-muted-foreground">Biometric sync, geolocation clock-ins, and overtime logs.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card/40 text-center">
          <span className="text-xs text-muted-foreground">Present Today</span>
          <p className="text-2xl font-bold text-primary mt-1">39</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card/40 text-center">
          <span className="text-xs text-muted-foreground">On Leave</span>
          <p className="text-2xl font-bold text-amber-500 mt-1">2</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card/40 text-center">
          <span className="text-xs text-muted-foreground">Work From Home</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">1</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <Calendar className="size-4 text-primary" /> Shift timing: 9:30 AM – 6:30 PM (Grace period: 15 mins)
      </p>
    </div>
  )
}

export function HrmsPayrollPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="preview-heading">Monthly Payroll Cycle</p>
          <p className="text-sm text-muted-foreground">PF, ESI, TDS calculations with 1-click salary disbursement.</p>
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">READY</span>
      </div>
      <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Net Payout:</span>
          <span className="font-bold text-base">₹18,45,200</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-2">
          <span>Statutory Deductions (TDS/PF):</span>
          <span>₹2,10,400</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Direct Bank Batches:</span>
          <span>42 Accounts</span>
        </div>
      </div>
    </div>
  )
}

// ==================== FSM PANELS ====================
export function FsmDispatchPanel() {
  const technicians = [
    { name: 'Vikram Singh', location: 'Indiranagar Sector 2', task: 'HVAC Repair #402', eta: '15 mins', status: 'En Route' },
    { name: 'Sanjay Kumar', location: 'Whitefield Main Rd', task: 'Fiber Terminal #811', eta: 'Arrived', status: 'On Site' },
    { name: 'Manoj Pillai', location: 'Koramangala 4th Blk', task: 'Annual Maintenance #109', eta: '45 mins', status: 'Scheduled' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="preview-heading">Live Field Dispatch</p>
          <p className="text-sm text-muted-foreground">Technician routes, GPS check-ins & customer ETA.</p>
        </div>
        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">8 Active Crews</span>
      </div>
      <div className="grid gap-2.5">
        {technicians.map((t) => (
          <div key={t.name} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/40">
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3 text-primary" /> {t.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-foreground">{t.task}</span>
              <span className="block text-xs text-primary font-mono">{t.status} ({t.eta})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FsmWorkOrdersPanel() {
  const orders = [
    { id: 'WO-819', client: 'Prestige Heights', priority: 'High', service: 'Transformer Inspection' },
    { id: 'WO-820', client: 'FabIndia Flagship', priority: 'Medium', service: 'Air Handling Duct Replacement' },
    { id: 'WO-821', client: 'Greenwood School', priority: 'Low', service: 'Water Purifier Filter Audit' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">Work Orders & Job Sheets</p>
        <p className="text-sm text-muted-foreground">Digital signature capture, parts consumed, and site photos.</p>
      </div>
      <div className="grid gap-2">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/30">
            <div>
              <span className="text-xs font-mono font-bold text-primary">{o.id}</span>
              <p className="text-sm font-medium">{o.client}</p>
              <span className="text-xs text-muted-foreground">{o.service}</span>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-secondary font-mono">{o.priority}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== OMS PANELS ====================
export function OmsOrdersStreamPanel() {
  const streams = [
    { orderId: 'ORD-7712', channel: 'Shopify Store', items: 3, total: '₹3,890', status: 'Packing' },
    { orderId: 'ORD-7711', channel: 'Amazon India', items: 1, total: '₹1,250', status: 'Dispatched' },
    { orderId: 'ORD-7710', channel: 'B2B Wholesale', items: 45, total: '₹48,900', status: 'Awaiting Pickup' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="preview-heading">Multichannel Order Feed</p>
          <p className="text-sm text-muted-foreground">Unified orders across e-commerce, marketplaces, and stores.</p>
        </div>
        <span className="text-xs font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-full">SYNCED</span>
      </div>
      <div className="grid gap-2.5">
        {streams.map((s) => (
          <div key={s.orderId} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/40">
            <div>
              <span className="text-xs font-mono font-bold text-foreground">{s.orderId}</span>
              <p className="text-xs text-muted-foreground">{s.channel} • {s.items} items</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold">{s.total}</span>
              <span className="block text-xs font-mono text-primary">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OmsFulfillmentPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="preview-heading">Fulfillment & Courier Routing</p>
        <p className="text-sm text-muted-foreground">Automated AWB generation, carrier rate comparison, and packing manifests.</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl border border-border bg-card/40">
          <span className="text-xs text-muted-foreground">Pending Pick</span>
          <p className="text-2xl font-bold mt-1">18</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card/40">
          <span className="text-xs text-muted-foreground">In Transit</span>
          <p className="text-2xl font-bold text-primary mt-1">142</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card/40">
          <span className="text-xs text-muted-foreground">Delivered Today</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">64</p>
        </div>
      </div>
      <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Delhivery & Bluedart API Active</span>
        <span className="text-muted-foreground">Latency: 42ms</span>
      </div>
    </div>
  )
}
