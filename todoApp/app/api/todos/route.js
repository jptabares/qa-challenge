import { NextResponse } from 'next/server';
import { getTodos, addTodo, deleteTodo } from '../../../lib/db';

export async function GET() {
  try {
    const todos = getTodos();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const todo = addTodo(text.trim());
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const todos = deleteTodo(id);
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
