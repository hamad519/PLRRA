import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) { // Added email to required fields
      return NextResponse.json({ message: 'Username, email, and password are required' }, { status: 400 });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json({ message: 'User with this username already exists' }, { status: 409 });
    }

    const existingUserByEmail = await User.findOne({ email }); // Check for existing email
    if (existingUserByEmail) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const user = await User.create({ username, email, password, role: role || 'user' }); // Added email to user creation
    
    return NextResponse.json({ message: 'User registered successfully', userId: user._id }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}