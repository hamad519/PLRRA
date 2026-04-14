import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Raw SQL for monthly aggregation — cleaner than fetching all users
    const rows = await prisma.$queryRaw<Array<{ year: number; month: number; count: bigint }>>`
      SELECT YEAR(createdAt) as year, MONTH(createdAt) as month, COUNT(*) as count
      FROM users
      GROUP BY YEAR(createdAt), MONTH(createdAt)
      ORDER BY year ASC, month ASC
    `;

    let cumulative = 0;
    const formattedData = rows.map((row) => {
      cumulative += Number(row.count);
      const date = new Date(row.year, row.month - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return { name: monthName, users: cumulative };
    });

    return NextResponse.json({ success: true, data: formattedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch user growth data', error: error.message }, { status: 500 });
  }
}
