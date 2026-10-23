'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  Columns3,
  LayoutDashboard,
  LockKeyhole,
  Server,
  Users,
  CircleCheck,
  Store,
  Receipt,
  ScanBarcode,
  UsersRound,
  Calendar,
  Wallet,
  MapPin,
  Wrench,
  Boxes,
  Truck,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/product/ui/tabs'
import { cn } from '@/lib/utils'
import { Brand } from './brand'
import {
  ContactsPanel,
  DealsPanel,
  OverviewPanel,
  TasksPanel,
  PossRegistersPanel,
  PossOrdersPanel,
  PossInventoryPanel,
  HrmsDirectoryPanel,
  HrmsAttendancePanel,
  HrmsPayrollPanel,
  FsmDispatchPanel,
  FsmWorkOrdersPanel,
  OmsOrdersStreamPanel,
  OmsFulfillmentPanel,
} from './preview-panels'

export type PreviewView = string

export interface PreviewTabConfig {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string; 'data-icon'?: string }>
}

export function getProductViews(slug: string = 'crm'): PreviewTabConfig[] {
  switch (slug) {
    case 'poss':
      return [
        { value: 'registers', label: 'Terminals', icon: Store },
        { value: 'orders', label: 'Receipts', icon: Receipt },
        { value: 'inventory', label: 'Stock Lookup', icon: ScanBarcode },
      ]
    case 'hrms':
      return [
        { value: 'directory', label: 'Team Roster', icon: UsersRound },
        { value: 'attendance', label: 'Attendance', icon: Calendar },
        { value: 'payroll', label: 'Payroll Run', icon: Wallet },
      ]
    case 'fsm':
      return [
        { value: 'dispatch', label: 'Dispatch Map', icon: MapPin },
        { value: 'workorders', label: 'Work Orders', icon: Wrench },
      ]
    case 'oms':
      return [
        { value: 'orders', label: 'Order Stream', icon: Boxes },
        { value: 'fulfillment', label: 'Fulfillment', icon: Truck },
      ]
    case 'crm':
    default:
      return [
        { value: 'overview', label: 'Overview', icon: LayoutDashboard },
        { value: 'contacts', label: 'Contacts', icon: Users },
        { value: 'deals', label: 'Pipeline', icon: Columns3 },
        { value: 'tasks', label: 'Follow-ups', icon: CircleCheck },
      ]
  }
}

export const previewViews = getProductViews('crm')

export function ProductPreview({
  id = 'crm',
  className,
  view,
  onViewChange,
}: {
  id?: string
  className?: string
  view?: string
  onViewChange?: (view: string) => void
}) {
  const views = useMemo(() => getProductViews(id), [id])
  const [internalView, setInternalView] = useState<string>(views[0]?.value || 'overview')
  const currentView = view ?? internalView

  return (
    <div className={cn('product-preview font-sans', className)} aria-label="Interactive workspace illustration with sample data">
      <div className="preview-chrome px-3.5">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-foreground/30" />
            <span className="size-1.5 rounded-full bg-foreground/20" />
            <span className="size-1.5 rounded-full bg-foreground/15" />
          </div>
          <span className="flex items-center gap-1.5 text-sm font-mono">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            your-company.local / {id.toUpperCase()}
          </span>
          <span className="size-4" aria-hidden="true" />
        </div>
      </div>
      <Tabs
        value={views.some((v) => v.value === currentView) ? currentView : views[0]?.value}
        onValueChange={(next) => {
          setInternalView(next)
          onViewChange?.(next)
        }}
        orientation="vertical"
        className="preview-layout"
      >
        <aside className="preview-sidebar">
          <div className="preview-sidebar-padding flex-1 p-4">
            <div className="preview-sidebar-content h-full">
              <div className="sidebar-brand"><Brand compact /></div>
              <div className="sidebar-workspace flex items-center justify-between gap-2 text-sm text-background/65">
                <span>{id.toUpperCase()} Workspace</span>
                <ChevronDown className="size-4" aria-hidden="true" />
              </div>
              <TabsList variant="workspace" aria-label="Workspace preview sections">
                {views.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger key={value} value={value} aria-label={label}>
                    <Icon data-icon="inline-start" />
                    <span className="sidebar-label">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex-1" />
              <div className="sidebar-footer flex items-center gap-2 text-sm text-background/60">
                <Server className="size-4" />
                <span>Self-hosted. All yours.</span>
              </div>
            </div>
          </div>
        </aside>
        <div className="preview-main">
          {id === 'crm' && (
            <>
              <TabsContent value="overview"><OverviewPanel /></TabsContent>
              <TabsContent value="contacts"><ContactsPanel /></TabsContent>
              <TabsContent value="deals"><DealsPanel /></TabsContent>
              <TabsContent value="tasks"><TasksPanel /></TabsContent>
            </>
          )}

          {id === 'poss' && (
            <>
              <TabsContent value="registers"><PossRegistersPanel /></TabsContent>
              <TabsContent value="orders"><PossOrdersPanel /></TabsContent>
              <TabsContent value="inventory"><PossInventoryPanel /></TabsContent>
            </>
          )}

          {id === 'hrms' && (
            <>
              <TabsContent value="directory"><HrmsDirectoryPanel /></TabsContent>
              <TabsContent value="attendance"><HrmsAttendancePanel /></TabsContent>
              <TabsContent value="payroll"><HrmsPayrollPanel /></TabsContent>
            </>
          )}

          {id === 'fsm' && (
            <>
              <TabsContent value="dispatch"><FsmDispatchPanel /></TabsContent>
              <TabsContent value="workorders"><FsmWorkOrdersPanel /></TabsContent>
            </>
          )}

          {id === 'oms' && (
            <>
              <TabsContent value="orders"><OmsOrdersStreamPanel /></TabsContent>
              <TabsContent value="fulfillment"><OmsFulfillmentPanel /></TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}
