import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(req: Request) {
  await dbConnect();

  try {
    // The middleware should already handle authentication and role checking for /admin routes.
    // If not, you would add explicit checks here.

    const users = await User.find({}).select('-password'); // Fetch all users, exclude password field
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users', error: error.message }, { status: 500 });
  }
}