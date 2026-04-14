import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Fan, Shirt, Sparkles, SprayCan, Truck, Waves } from "lucide-react";

import { serviceCatalog } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

type DetailPageProps = {
  params: {
    slug: string;
  };
};

const iconMap = {
  sparkles: Sparkles,
  "spray-can": SprayCan,
  bath: Waves,
  shirt: Shirt,
  fan: Fan,
  truck: Truck,
} as const;

export function generateStaticParams() {
  return serviceCatalog.map((service) => ({ slug: service.id }));
}

export default function DetailLayananPage({ params }: DetailPageProps) {
  const service = serviceCatalog.find((item) => item.id === params.slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon];
  const relatedServices = serviceCatalog
    .filter((item) => item.id !== service.id && item.kategori === service.kategori)
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="section-label">Detail layanan</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="h2-title text-neutral-900">{service.nama}</h1>
            <p className="mt-2 max-w-2xl text-neutral-600">{service.deskripsi}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-brand-primary-light px-3 py-2 text-sm font-bold text-brand-primary-dark">
            <Icon className="size-4" />
            {service.kategori}
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-8">
          <h2 className="h3-title text-neutral-900">Rincian manfaat layanan</h2>
          <ul className="mt-4 space-y-3">
            {service.fitur.map((fitur) => (
              <li key={fitur} className="flex items-start gap-2 text-sm text-neutral-700">
                <BadgeCheck className="mt-0.5 size-4 text-green-600" />
                {fitur}
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Harga mulai dari</p>
          <p className="mt-2 font-heading text-3xl font-black text-brand-primary-dark">
            {service.hargaMax
              ? `${formatRupiah(service.hargaMin)} - ${formatRupiah(service.hargaMax)}`
              : formatRupiah(service.hargaMin)}
          </p>
          <p className="mt-2 text-sm text-neutral-600">Harga final bisa menyesuaikan tingkat kotor ruangan dan jarak layanan.</p>

          <div className="mt-5 grid gap-2">
            <Link
              href={`/transaksi?layanan=${service.id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 text-sm font-bold text-white hover:bg-brand-primary-dark"
            >
              Pesan layanan ini
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/layanan"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-700"
            >
              Kembali ke katalog
            </Link>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="h3-title text-neutral-900">Layanan terkait</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {relatedServices.map((item) => (
            <Link
              key={item.id}
              href={`/layanan/${item.id}`}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:border-brand-primary/20 hover:bg-white"
            >
              <p className="text-sm font-bold text-neutral-900">{item.nama}</p>
              <p className="mt-1 text-xs text-neutral-600">{formatRupiah(item.hargaMin)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
