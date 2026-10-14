import { openUrl } from "@tauri-apps/plugin-opener";
import { DownloadIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpdaterStore } from "@/stores/updater-store";

export function UpdateDialog() {
  const { update, currentVersion, dialogOpen, setDialogOpen } = useUpdaterStore();

  if (!update) return null;

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update available</AlertDialogTitle>
          <AlertDialogDescription>
            Version {update.version} is out. You have {currentVersion}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {update.notes && (
          <div className="max-h-48 overflow-y-auto rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
            {update.notes}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Later</AlertDialogCancel>
          <AlertDialogAction onClick={() => openUrl(update.downloadUrl)}>
            <DownloadIcon />
            Download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
