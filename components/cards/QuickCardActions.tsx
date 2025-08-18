"use client";

import React from "react";
import { useToast } from "@/components/providers/SonnerToastProvider";
import {
  toggleCardActiveAction,
  toggleCardPriorityAction,
} from "@/lib/actions/banking.actions";
import { useActionState, useEffect, useTransition } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Props {
  accountId: string;
  isActive: boolean;
  priority?: boolean;
}

type ActionResult =
  | { ok: true; action: "active"; id: string; isActive: boolean }
  | { ok: true; action: "priority"; id: string; priority: boolean }
  | { error: string };

export default function QuickCardActions({
  accountId,
  isActive,
  priority,
}: Props) {
  // No router, use window.location.reload() if needed
  const { showSuccess, showError } = useToast();

  const [activeState, activeAction, activePending] = useActionState(
    toggleCardActiveAction as unknown as (
      state: ActionResult | null,
      formData: FormData
    ) => Promise<ActionResult>,
    null as ActionResult | null
  );
  const [prioState, prioAction, prioPending] = useActionState(
    toggleCardPriorityAction as unknown as (
      state: ActionResult | null,
      formData: FormData
    ) => Promise<ActionResult>,
    null as ActionResult | null
  );

  // Show toasts after server action responses
  useEffect(() => {
    if (!activeState) return;
    if ("error" in activeState) {
      if (activeState.error === "Please sign in") {
        showError("Please sign in to manage cards.");
      } else {
        showError(activeState.error);
      }
    } else if (activeState.ok && activeState.action === "active") {
      showSuccess(activeState.isActive ? "Card activated" : "Card deactivated");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeState]);

  useEffect(() => {
    if (!prioState) return;
    if ("error" in prioState) {
      if (prioState.error === "Please sign in") {
        showError("Please sign in to manage cards.");
      } else {
        showError(prioState.error);
      }
    } else if (prioState.ok && prioState.action === "priority") {
      showSuccess(
        prioState.priority ? "Marked as priority" : "Priority removed"
      );
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prioState]);

  // Confirm dialog state for deactivation
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const pendingDeactivate = isActive; // show confirm only when deactivating
  const [, startTrans] = useTransition();

  const onSubmitActive = (e: React.FormEvent<HTMLFormElement>) => {
    if (pendingDeactivate) {
      e.preventDefault();
      formRef.current = e.currentTarget;
      setConfirmOpen(true);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Toggle Active */}
      <form action={activeAction} onSubmit={onSubmitActive}>
        <input type="hidden" name="accountId" value={accountId} />
        <input
          type="hidden"
          name="isActive"
          value={(isActive ? false : true).toString()}
        />
        <button
          type="submit"
          className="rounded-md bg-white/90 text-gray-800 border border-gray-200 text-[10px] px-2 py-1 hover:bg-white shadow-sm disabled:opacity-60"
          disabled={activePending}
          aria-disabled={activePending}
          title={isActive ? "Deactivate" : "Activate"}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </form>

      {/* Toggle Priority */}
      <form action={prioAction}>
        <input type="hidden" name="accountId" value={accountId} />
        <input
          type="hidden"
          name="priority"
          value={(!Boolean(priority)).toString()}
        />
        <button
          type="submit"
          className="rounded-md bg-white/90 text-gray-800 border border-gray-200 text-[10px] px-2 py-1 hover:bg-white shadow-sm disabled:opacity-60"
          disabled={prioPending}
          aria-disabled={prioPending}
          title={priority ? "Unmark priority" : "Mark priority"}
        >
          {priority ? "Unmark" : "Priority"}
        </button>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title="Deactivate this card?"
        description="You can re-activate it anytime."
        confirmText="Deactivate"
        onConfirmAction={() => {
          setConfirmOpen(false);
          // After confirmation, submit the stored form
          if (formRef.current) {
            const fd = new FormData(formRef.current);
            // call action manually to avoid double-submit
            startTrans(() => {
              activeAction(fd as unknown as FormData);
            });
            formRef.current = null;
          }
        }}
        onCancelAction={() => {
          setConfirmOpen(false);
          formRef.current = null;
        }}
      />
    </div>
  );
}
