import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RotateCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/bullet-optimizer")({
  head: () => ({
    meta: [{ title: "Bullet Optimizer — ResumeRAG" }],
  }),
  component: BulletOptimizer,
});

function BulletOptimizer() {
  const [input, setInput] = useState(
    "Developed backend for library system."
  );

  const [output, setOutput] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Call real backend
  const run = async () => {
    // Validate input
    if (!input.trim()) {
      setError("Please enter a resume bullet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Optimizing bullet:", input);

      // Send bullet to backend
      const result = await api.optimizeBullet(
        input.trim()
      );

      console.log(
        "OPTIMIZER RESPONSE:",
        result
      );

      // Get optimized bullet from backend response
      setOutput(result.optimizedBullet);

    } catch (err) {
      console.error(
        "Bullet optimization failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to optimize bullet."
      );

    } finally {
      setLoading(false);
    }
  };

  // Copy result
  const copyResult = async () => {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);

      toast.success(
        "Copied to clipboard"
      );

    } catch {
      toast.error(
        "Failed to copy"
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader
        title="Bullet Optimizer"
        description="Rewrite weak resume bullets into strong, quantified impact statements."
      />

      {/* ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">

          <p className="text-sm text-destructive">
            {error}
          </p>

        </div>
      )}

      {/* OPTIMIZER */}

      <div className="grid gap-4 md:grid-cols-2">

        {/* ORIGINAL BULLET */}

        <div className="rounded-md border bg-card p-4">

          <p className="text-xs font-medium text-muted-foreground">
            Original
          </p>

          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            rows={6}
            className="mt-2 resize-none"
            placeholder="Enter a resume bullet..."
          />

          <Button
            className="mt-3 w-full"
            onClick={run}
            disabled={loading || !input.trim()}
          >

            <Sparkles className="h-4 w-4" />

            {loading
              ? "Rewriting..."
              : "Improve"}

          </Button>

        </div>

        {/* IMPROVED BULLET */}

        <div className="rounded-md border bg-card p-4">

          <p className="text-xs font-medium text-muted-foreground">
            Improved
          </p>

          <div className="mt-2 min-h-[144px] rounded-md border border-dashed bg-background p-3 text-sm">

            {loading ? (

              <span className="text-muted-foreground">
                Optimizing your bullet...
              </span>

            ) : output ? (

              output

            ) : (

              <span className="text-muted-foreground">
                Your improved bullet will appear here.
              </span>

            )}

          </div>

          {/* ACTION BUTTONS */}

          <div className="mt-3 flex gap-2">

            {/* COPY */}

            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={!output}
              onClick={copyResult}
            >

              <Copy className="h-3.5 w-3.5" />

              Copy

            </Button>

            {/* REGENERATE */}

            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={!output || loading}
              onClick={run}
            >

              <RotateCw className="h-3.5 w-3.5" />

              Regenerate

            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}