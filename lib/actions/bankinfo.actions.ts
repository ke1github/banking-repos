"use server";

export type IfscDetails = {
  BANK?: string;
  IFSC?: string;
  BRANCH?: string;
  ADDRESS?: string;
  CITY?: string;
  DISTRICT?: string;
  STATE?: string;
  CONTACT?: string;
  MICR?: string | number | null;
  UPI?: boolean;
  RTGS?: boolean;
  NEFT?: boolean;
  IMPS?: boolean;
  BANKCODE?: string;
};

// Server Action: Lookup Indian bank details by IFSC via Razorpay IFSC API
export async function lookupIfscAction(
  _prev: unknown,
  formData: FormData
): Promise<{ ok: true; data: IfscDetails } | { error: string }> {
  try {
    const raw = String(formData.get("ifsc") || "")
      .trim()
      .toUpperCase();
    if (!raw) return { error: "Enter an IFSC code" } as const;
    // Basic sanity: IFSC codes are typically 11 characters
    if (raw.length < 4) return { error: "Invalid IFSC" } as const;

    const url = `https://ifsc.razorpay.com/${encodeURIComponent(raw)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return { error: "IFSC not found" } as const;
      return { error: `Lookup failed (${res.status})` } as const;
    }
    const data = (await res.json()) as IfscDetails;
    return { ok: true, data } as const;
  } catch (err) {
    console.error("lookupIfscAction error", err);
    return { error: "Failed to lookup IFSC" } as const;
  }
}
