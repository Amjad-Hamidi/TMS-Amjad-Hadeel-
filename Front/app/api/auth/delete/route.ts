import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDB();

    // Delete the user from the database
    const user = await User.findByIdAndDelete(decoded.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
  