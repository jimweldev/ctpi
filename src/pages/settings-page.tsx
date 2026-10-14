import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdaterStore } from "@/stores/updater-store";

export function SettingsPage() {
  const { status, currentVersion, checkForUpdate } = useUpdaterStore();

  async function handleCheck() {
    const result = await checkForUpdate();
    if (result === "up-to-date") toast.success("You're on the latest version.");
    if (result === "error") {
      toast.error(useUpdaterStore.getState().error ?? "Update check failed.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>App version</CardTitle>
        <CardDescription>{currentVersion ? `v${currentVersion}` : "Unknown"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleCheck} disabled={status === "checking"}>
          <RefreshCwIcon className={status === "checking" ? "animate-spin" : undefined} />
          Check for updates
        </Button>
      </CardContent>
    </Card>
  );
}
