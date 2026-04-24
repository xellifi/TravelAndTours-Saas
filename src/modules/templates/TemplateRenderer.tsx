import TravelTemplate from './TravelTemplate';
import RestaurantTemplate from './RestaurantTemplate';
import FitnessTemplate from './FitnessTemplate';
import { SalonTemplate, CorporateTemplate } from './OtherTemplates';

const templates: Record<string, React.ComponentType<any>> = {
  travel: TravelTemplate,
  restaurant: RestaurantTemplate,
  fitness: FitnessTemplate,
  salon: SalonTemplate,
  corporate: CorporateTemplate,
};

export default function TemplateRenderer({
  business,
  services,
  bookingLimitReached,
  paymentSettings,
}: {
  business: any;
  services: any[];
  bookingLimitReached: boolean;
  paymentSettings: any | null;
}) {
  const Template = templates[business.template_id] || TravelTemplate;
  return (
    <Template
      business={business}
      services={services}
      bookingLimitReached={bookingLimitReached}
      paymentSettings={paymentSettings}
    />
  );
}
