import { useEffect } from "react";
import { RouterProvider } from "react-router";

import { UpdateDialog } from "@/components/update-dialog";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/router";
import { useUpdaterStore } from "@/stores/updater-store";

function App() {
  useEffect(() => {
    useUpdaterStore.getState().checkForUpdate();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <UpdateDialog />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
