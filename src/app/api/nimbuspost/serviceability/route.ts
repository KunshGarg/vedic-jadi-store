import { NextRequest, NextResponse } from "next/server";
import { checkServiceability } from "@/lib/nimbuspost";

// GET /api/nimbuspost/serviceability?pincode=110001
// Used by the product page's "check delivery" pincode box.
export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pincode");
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Enter a valid 6-digit pincode" }, { status: 400 });
  }
  try {
    const result = await checkServiceability(pincode);
    return NextResponse.json(result);
  } catch (err) {
    console.error("serviceability check failed", err);
    return NextResponse.json({ serviceable: null, error: "Check failed" }, { status: 500 });
  }
}
