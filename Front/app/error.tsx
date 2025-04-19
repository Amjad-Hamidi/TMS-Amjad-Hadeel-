"use client";

export default function ErrorPage({ error, reset }:{error:any,reset:any}) {
  return (
    <div className="text-center text-red-600 h-screen">
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
