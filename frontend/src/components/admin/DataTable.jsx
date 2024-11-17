import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const DataTable = ({
    columns,
    data,
    filterPlaceholder,
    filterValue,
    onFilterChange,
    columnVisibility,
    setColumnVisibility,
    currentPage,
    pageCount,
    onPageChange,
    onRowClick,
    renderRowActions,
    renderCustomHeader,
    loading
}) => {
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (data !== undefined) {
                setIsLoading(false)
            }
        }, 1500)

        return () => clearTimeout(timer)
    }, [data])

    return (
        <div className="space-y-4">
            <div className="flex items-center py-4">
                <Input
                    placeholder={filterPlaceholder}
                    value={filterValue}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {Object.entries(columnVisibility).map(([key, value]) => (
                            <DropdownMenuCheckboxItem
                                key={key}
                                className="capitalize"
                                checked={value}
                                onCheckedChange={(checked) =>
                                    setColumnVisibility(prev => ({ ...prev, [key]: checked }))
                                }
                            >
                                {key}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {renderCustomHeader?.()}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                columnVisibility[column.key] && (
                                    <TableHead key={column.key}>{column.label}</TableHead>
                                )
                            ))}
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading || isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-[250px]">
                                    <div className="flex justify-center items-center">
                                        <div
                                            className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
                                            style={{
                                                borderTopColor: '#1a1a1a',
                                                animationDuration: '0.6s'
                                            }}
                                            role="status"
                                            aria-label="Loading"
                                        >
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : !data || data.length === 0 ? (
                            <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="text-center h-[250px]">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow
                                    key={item._id}
                                    onClick={() => onRowClick?.(item._id)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    {columns.map((column) => (
                                        columnVisibility[column.key] && (
                                            <TableCell key={column.key}>
                                                {column.render ? column.render(item) : item[column.key]}
                                            </TableCell>
                                        )
                                    ))}
                                    <TableCell>
                                        {renderRowActions?.(item)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {currentPage + 1} of {pageCount}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= pageCount - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataTable
