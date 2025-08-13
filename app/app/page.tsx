import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <section className="flex flex-col gap-4 md:w-auto w-11/12">
        <h1 className="text-4xl font-bold">Readstream</h1>
        <p className="text-muted-foreground">
          A simple tool to upload and preview README files in your browser
        </p>
        <Link href="/app">
          <Button size={"lg"} className="cursor-pointer w-full mt-2">
            Get started
          </Button>
        </Link>
      </section>
    </div>
  );
}
