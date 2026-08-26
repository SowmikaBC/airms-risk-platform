import React from "react";
import { Link } from "wouter";
import { AlertOctagon } from "lucide-react";

export function NotFound() {
  return (
    <div className="panel p-12 text-center space-y-4 max-w-md mx-auto my-12">
      <AlertOctagon size={36} className="mx-auto text-destructive" />
      <h1 className="text-xl font-bold">404 â€” Page Not Found</h1>
      <p className="text-xs text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
        Go to overview
      </Link>
    </div>
  );
}
