"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User as UserIcon, Edit, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.message || 'Failed to fetch users');
          toast.error(data.message || 'Failed to fetch users');
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId: number) => {
    toast.info(`Edit user ${userId} - functionality coming soon!`);
  };

  const handleDelete = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete user');
      }
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-4">
        Manage Users
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        View and manage all registered user accounts.
      </p>
      <div className="flex justify-end mb-6">
        <Link href="/admin/register">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add User</Button>
        </Link>
      </div>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">ID</TableHead>
              <TableHead className="text-white font-bold">Username</TableHead>
              <TableHead className="text-white font-bold">Email</TableHead>
              <TableHead className="text-white font-bold">Role</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={5} />
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500 py-8">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-admin-text-secondary py-8">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-admin-border/50 hover:bg-admin-hover-bg">
                  <TableCell className="font-medium text-admin-text-primary">{user.id}</TableCell>
                  <TableCell className="text-admin-text-primary flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-admin-accent" /> {user.username}
                  </TableCell>
                  <TableCell className="text-admin-text-primary">{user.email}</TableCell>
                  <TableCell className="text-admin-text-primary capitalize">{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user.id)}
                      className="text-admin-accent hover:bg-admin-hover-bg mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete user?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{user.username}</strong>. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
