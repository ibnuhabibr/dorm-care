import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const { orderId, orderNumber, dataUri, fileExt } = await req.json();

    if (!orderId || !dataUri) {
      return NextResponse.json({ error: "orderId dan dataUri wajib" }, { status: 400 });
    }

    // Get order details for user_id and amount
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("user_id, total_amount")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Decode base64 data URI to binary
    const base64Data = dataUri.split(",")[1];
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `proof_${orderId}.${fileExt || "jpg"}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(fileName, binaryData, {
        contentType: `image/${fileExt || "jpg"}`,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(fileName);

    const proofUrl = urlData?.publicUrl || "";

    // Delete existing transaction for this order, then insert
    await supabase.from("transactions").delete().eq("order_id", orderId);

    const { error: txError } = await supabase.from("transactions").insert({
      order_id: orderId,
      user_id: order.user_id,
      amount: order.total_amount,
      status: "verified",
      proof_url: proofUrl,
      payment_method: "qris",
    });

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    return NextResponse.json({ proofUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload gagal" },
      { status: 500 }
    );
  }
}
