"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface DataTableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  render: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  total: number
  page: number
  limit: number
  basePath: string
  getRowId: (row: T) => string
  rowActions?: (row: T) => React.ReactNode
  searchPlaceholder?: string
}

function DataTable<T>({
  columns,
  rows,
  total,
  page,
  limit,
  basePath,
  getRowId,
  rowActions,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = React.useState(searchParams.get("q") ?? "")

  const currentSort = searchParams.get("sort") ?? ""
  const totalPages = Math.max(1, Math.ceil(total / limit))

  function buildUrl(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    return `${basePath}?${params.toString()}`
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault()
    router.push(buildUrl({ q: searchValue || null, page: null }))
  }

  function sortIndicator(key: string) {
    if (currentSort === key) return <ArrowUpIcon className="size-3" />
    if (currentSort === `-${key}`) return <ArrowDownIcon className="size-3" />
    return null
  }

  function nextSortValue(key: string) {
    if (currentSort === key) return `-${key}`
    if (currentSort === `-${key}`) return null
    return key
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearchSubmit} className="flex max-w-sm items-center gap-2">
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={searchPlaceholder}
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Search">
          <SearchIcon />
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.sortable ? (
                  <Link
                    href={buildUrl({ sort: nextSortValue(column.key), page: null })}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {column.label}
                    {sortIndicator(column.key)}
                  </Link>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
            {rowActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render(row)}
                </TableCell>
              ))}
              {rowActions && (
                <TableCell className="flex justify-end gap-2">{rowActions(row)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-2">
            {page <= 1 ? (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildUrl({ page: String(page - 1) })} />}
              >
                Previous
              </Button>
            )}
            {page >= totalPages ? (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildUrl({ page: String(page + 1) })} />}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { DataTable }
