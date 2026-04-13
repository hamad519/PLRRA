"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface UserGrowthDataItem {
  name: string;
  users: number;
}

export const UsersGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard/user-growth');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setUserGrowthData(data.data);
        } else {
          setError(data.message || 'Failed to fetch user growth data');
          toast.error(data.message || 'Failed to fetch user growth data');
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGrowthData();
  }, []);

  if (loading) {
    return (
      <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-admin-accent text-2xl font-bold">User Registrations Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-admin-text-secondary">Loading user growth data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-admin-accent text-2xl font-bold">User Registrations Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-admin-accent text-2xl font-bold">User Registrations Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userGrowthData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-border))" />
            <XAxis dataKey="name" stroke="hsl(var(--admin-text-secondary))" />
            <YAxis stroke="hsl(var(--admin-text-secondary))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--admin-card-bg))',
                borderColor: 'hsl(var(--admin-border))',
                color: 'hsl(var(--admin-text-primary))'
              }}
              itemStyle={{ color: 'hsl(var(--admin-text-primary))' }}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--admin-text-primary))' }} />
            <Line type="monotone" dataKey="users" stroke="hsl(var(--admin-accent))" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};