import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPageLayout from '@/components/admin/AdminPageLayout'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Lock, Unlock } from "lucide-react"
import { getFlagImage } from '@/utils/flag'
import countries from '@/utils/countries'
import useAccount from '@/zustand/useAccount'

const ManageAccount = () => {
    const { accounts, loading, getAccounts, lockAccount, unlockAccount } = useAccount()
    const navigate = useNavigate()
    const [filterEmail, setFilterEmail] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [columnVisibility, setColumnVisibility] = useState({
        full_name: true,
        username: true,
        email: true,
        gender: true,
        location: true,
        status: true
    })

    React.useEffect(() => {
        getAccounts(currentPage, itemsPerPage)
    }, [getAccounts, currentPage, itemsPerPage])

    const filteredAccounts = accounts?.filter(account =>
        account.email.toLowerCase().includes(filterEmail.toLowerCase())
    )

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

    const handleLockAccount = (id) => {
        lockAccount(id)
    }

    const handleUnlockAccount = (id) => {
        unlockAccount(id)
    }

    const columns = [
        { key: 'full_name', label: 'Full Name' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        {
            key: 'gender',
            label: 'Gender',
            render: (account) => account.gender ? 'Male' : 'Female'
        },
        {
            key: 'location',
            label: 'Location',
            render: (account) => (
                <div className="flex items-center space-x-2">
                    <img
                        src={getFlagImage(account.location)}
                        alt={account.location}
                        className="w-6 h-4 rounded-sm shadow-md"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                        {countries.find(country => country.code === account.location)?.name || account.location}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (account) => <StatusBadge status={account.status === 'unblock' ? 'Active' : 'Locked'} />
        }
    ]

    const renderRowActions = (account) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {account.status === 'block' ? (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUnlockAccount(account._id)
                        }}
                    >
                        <Unlock className="mr-2 h-4 w-4" />
                        Unlock Account
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleLockAccount(account._id)
                        }}
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        Lock Account
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <AdminPageLayout title="Manage Account">
            <DataTable
                columns={columns}
                data={filteredAccounts}
                filterPlaceholder="Filter emails..."
                filterValue={filterEmail}
                onFilterChange={setFilterEmail}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                currentPage={currentPage}
                pageCount={useAccount.getState().pagination?.totalPages || 1}
                onPageChange={handlePageChange}
                onRowClick={(id) => navigate(`/admin/manage/accounts/${id}`)}
                renderRowActions={renderRowActions}
                loading={loading}
            />
        </AdminPageLayout>
    )
}

export default ManageAccount
