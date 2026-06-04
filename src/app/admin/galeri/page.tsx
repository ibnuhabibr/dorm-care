"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ImageIcon, Plus, Trash2, Upload, Eye, EyeOff, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export default function AdminGaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    caption: "",
    sort_order: 0,
    file: null as File | null,
    preview: null as string | null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();

  const fetchGallery = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, file, preview }));
  };

  const resetForm = () => {
    setForm({ caption: "", sort_order: 0, file: null, preview: null });
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!supabase) {
      toast.error("Supabase client tidak tersedia");
      return;
    }

    if (!form.file && !editingId) {
      toast.error("Pilih file gambar terlebih dahulu");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = "";

      if (form.file) {
        const fileExt = form.file.name.split(".").pop() || "jpg";
        const fileName = `gallery_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, form.file, {
            contentType: form.file.type,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        imageUrl = urlData?.publicUrl || "";
      }

      if (editingId) {
        const updateData: Record<string, unknown> = {
          caption: form.caption || null,
          sort_order: form.sort_order,
        };
        if (imageUrl) updateData.image_url = imageUrl;

        const { error } = await supabase
          .from("gallery")
          .update(updateData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Gambar berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("gallery")
          .insert({
            image_url: imageUrl,
            caption: form.caption || null,
            sort_order: form.sort_order,
            is_active: true,
          });

        if (error) throw error;
        toast.success("Gambar berhasil ditambahkan");
      }

      resetForm();
      fetchGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan gambar");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (item: GalleryItem) => {
    if (!supabase) return;

    const { error } = await supabase
      .from("gallery")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    if (error) {
      toast.error("Gagal mengubah status");
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, is_active: !i.is_active } : i
      )
    );
    toast.success(item.is_active ? "Gambar disembunyikan" : "Gambar ditampilkan");
  };

  const deleteItem = async (item: GalleryItem) => {
    if (!supabase) return;
    if (!confirm(`Hapus gambar "${item.caption || "tanpa caption"}"?`)) return;

    const { error } = await supabase.from("gallery").delete().eq("id", item.id);

    if (error) {
      toast.error("Gagal menghapus gambar");
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success("Gambar berhasil dihapus");
  };

  const editItem = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({
      caption: item.caption || "",
      sort_order: item.sort_order,
      file: null,
      preview: item.image_url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeCount = items.filter((i) => i.is_active).length;

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Galeri</h1>
        <p className="mt-2 text-neutral-600">
          Kelola foto dokumentasi yang ditampilkan di halaman Tentang Kami.
        </p>
      </section>

      <AdminNav />

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-3xl font-black text-neutral-900">{items.length}</p>
          <p className="text-sm text-neutral-500 mt-1">Total Gambar</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-3xl font-black text-green-600">{activeCount}</p>
          <p className="text-sm text-neutral-500 mt-1">Aktif / Ditampilkan</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-3xl font-black text-neutral-400">{items.length - activeCount}</p>
          <p className="text-sm text-neutral-500 mt-1">Tersembunyi</p>
        </article>
      </section>

      {/* Add/Edit Form */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-black text-neutral-900">
          {editingId ? "Edit Gambar" : "Tambah Gambar Baru"}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          {editingId
            ? "Ubah caption, urutan, atau ganti file gambar."
            : "Upload gambar baru ke galeri. Format JPG/PNG/WebP, maks 5MB."}
        </p>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {/* Upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 transition hover:border-brand-primary hover:bg-brand-primary-light/10"
          >
            {form.preview ? (
              <>
                <Image
                  src={form.preview}
                  alt="Preview"
                  fill
                  className="rounded-2xl object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <p className="text-sm font-bold text-white">Klik untuk ganti gambar</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="size-10 text-neutral-400 group-hover:text-brand-primary transition" />
                <p className="text-sm font-semibold text-neutral-500 group-hover:text-brand-primary transition">
                  Klik untuk pilih gambar
                </p>
                <p className="text-xs text-neutral-400">JPG, PNG, atau WebP. Maks 5MB.</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-neutral-700">Caption (opsional)</span>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                placeholder="Hasil pembersihan kamar kos..."
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-neutral-700">Urutan Tampil</span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="h-10 w-32 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
              />
              <p className="text-xs text-neutral-400 mt-1">Angka kecil tampil lebih dulu.</p>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={uploading || (!form.file && !editingId)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {uploading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Plus className="size-4" />
                )}
                {editingId ? "Simpan Perubahan" : "Tambah ke Galeri"}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-black text-neutral-900 mb-4">Daftar Gambar</h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <ImageIcon className="mx-auto size-10 text-neutral-400 mb-3" />
            <p className="font-semibold text-neutral-500">Belum ada gambar di galeri</p>
            <p className="text-xs text-neutral-400 mt-1">Tambah gambar menggunakan form di atas.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border bg-neutral-100 transition ${
                  item.is_active ? "border-neutral-200" : "border-red-200 opacity-60"
                }`}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.image_url}
                    alt={item.caption || "Galeri"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {!item.is_active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        TERSEMBUNYI
                      </span>
                    </div>
                  )}
                  {/* Action overlay */}
                  <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => editItem(item)}
                      className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-white/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(item)}
                      className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-white/30 transition"
                    >
                      {item.is_active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button
                      onClick={() => deleteItem(item)}
                      className="rounded-lg bg-red-500/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-red-500/80 transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {(item.caption || item.sort_order !== undefined) && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <p className="text-xs text-neutral-600 truncate">
                      {item.caption || "(tanpa caption)"}
                    </p>
                    <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500">
                      #{item.sort_order}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
