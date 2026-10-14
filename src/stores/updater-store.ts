import { getVersion } from "@tauri-apps/api/app";
import { create } from "zustand";

import { GITHUB_REPO } from "@/config";
import { githubApi } from "@/lib/api";
import { compareVersions } from "@/lib/version";

type GithubRelease = {
  tag_name: string;
  body: string | null;
  html_url: string;
  published_at: string;
  assets: { name: string; browser_download_url: string }[];
};

export type AvailableUpdate = {
  version: string;
  notes: string;
  downloadUrl: string;
  publishedAt: string;
};

type UpdaterStatus = "idle" | "checking" | "available" | "up-to-date" | "error";

type UpdaterState = {
  status: UpdaterStatus;
  currentVersion: string | null;
  update: AvailableUpdate | null;
  error: string | null;
  dialogOpen: boolean;
  checkForUpdate: () => Promise<UpdaterStatus>;
  setDialogOpen: (open: boolean) => void;
};

export const useUpdaterStore = create<UpdaterState>((set, get) => ({
  status: "idle",
  currentVersion: null,
  update: null,
  error: null,
  dialogOpen: false,

  checkForUpdate: async () => {
    if (get().status === "checking") return "checking";
    set({ status: "checking", error: null });

    try {
      const currentVersion = await getVersion();
      const { data } = await githubApi.get<GithubRelease>(
        `/repos/${GITHUB_REPO}/releases/latest`,
      );

      if (compareVersions(data.tag_name, currentVersion) <= 0) {
        set({ status: "up-to-date", currentVersion, update: null });
        return "up-to-date";
      }

      // Prefer the APK asset; fall back to the release page.
      const apk = data.assets.find((a) => a.name.toLowerCase().endsWith(".apk"));
      set({
        status: "available",
        currentVersion,
        dialogOpen: true,
        update: {
          version: data.tag_name.replace(/^v/i, ""),
          notes: data.body ?? "",
          downloadUrl: apk?.browser_download_url ?? data.html_url,
          publishedAt: data.published_at,
        },
      });
      return "available";
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : String(e) });
      return "error";
    }
  },

  setDialogOpen: (open) => set({ dialogOpen: open }),
}));
