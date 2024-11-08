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
    const { accounts, getAccounts, lockAccount, unlockAccount } = useAccount()
    const navigate = useNavigate()
    const [filterEmail, setFilterEmail] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [columnVisibility, setColumnVisibility] = useState({
        full_name: true,
        username: true,
        email: true,
        gender: true,
        location: true,
        status: true
    })

    React.useEffect(() => {
        getAccounts()
    }, [getAccounts])

    const ITEMS_PER_PAGE = 5;
    const filteredAccounts = accounts.filter(account =>
        account.email.toLowerCase().includes(filterEmail.toLowerCase())
    )
    const pageCount = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE)
    const displayedAccounts = filteredAccounts.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

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
                data={displayedAccounts}
                filterPlaceholder="Filter emails..."
                filterValue={filterEmail}
                onFilterChange={setFilterEmail}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                onRowClick={(id) => navigate(`/admin/manage/accounts/${id}`)}
                renderRowActions={renderRowActions}
            />
        </AdminPageLayout>
    )
}

export default ManageAccount
