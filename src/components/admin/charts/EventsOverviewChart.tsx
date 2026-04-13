"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data for events and competitions overview
const eventsOverviewData = [
  { name: 'Events', 'Upcoming': 5, 'Past': 25 },
  { name: 'Competitions', 'Upcoming': 2, 'Past': 10 },
];

export const EventsOverviewChart = () => {
  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-admin-accent text-2xl font-bold">Events & Competitions Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={eventsOverviewData}
            margin={{
              top: 20,
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
            <Bar dataKey="Upcoming" fill="hsl(var(--admin-accent))" />
            <Bar dataKey="Past" fill="hsl(var(--admin-text-secondary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};