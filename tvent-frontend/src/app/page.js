import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold text-red-500">Hello Tailwind!</h1>
      <Link href="/about">About</Link>
    </>
  );
}
