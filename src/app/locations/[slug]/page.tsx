import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ModernNavbar } from "@/sections/ModernNavbar";
import { ModernFooter } from "@/sections/ModernFooter";
import { LocationPageClient } from "./LocationPageClient";
import { locationsData } from "@/data/locations";

type Props = {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return locationsData.map((location) => ({
    slug: location.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = locationsData.find((loc) => loc.id === slug);

  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  return {
    title: `Cash For Cars in ${location.name} | Sell My Cars`,
    description: `${location.description.substring(0, 155)}...`,
    openGraph: {
      title: `Cash For Cars in ${location.name}`,
      description: location.description,
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = locationsData.find((loc) => loc.id === slug);

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar />
      <LocationPageClient
        locationName={location.name}
        region={location.region}
        suburbs={location.suburbs}
        landmarks={location.landmarks}
        description={location.description}
        mapUrl={location.mapUrl}
        coordinates={location.coordinates}
      />
      <ModernFooter />
    </div>
  );
}
