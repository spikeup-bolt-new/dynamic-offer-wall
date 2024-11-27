export interface OfferLogo {
  dark: string;
  light: string;
  alt: string;
}

export interface CountryFlag {
  name: string;
  url: string;
}

export interface OfferHeadline {
  title: string | null;
}

export interface OfferBulletPoint {
  title: string;
}

export interface OfferLinks {
  offer: string;
  review: string;
  terms: string;
  banner: string;
}

export interface OfferCTA {
  one: string;
  two: string;
}

export interface DepositMethod {
  dark_url: string;
  light_url: string;
  name: string;
}

export interface Offer {
  offer_id: number;
  brand: string;
  countries: string[];
  countries_flags: CountryFlag[];
  language: string;
  logo: OfferLogo;
  headlines: {
    one: OfferHeadline;
    two: OfferHeadline;
    three: OfferHeadline;
    four: OfferHeadline;
    five: OfferHeadline;
    six: OfferHeadline;
  };
  bullet_points: {
    one: OfferBulletPoint;
    two: OfferBulletPoint;
    three: OfferBulletPoint;
    four: OfferBulletPoint;
  };
  ribbon?: string;
  stars: number;
  links: OfferLinks;
  cta: OfferCTA;
  deposits: DepositMethod[];
  coupon_title?: string;
  coupon?: string;
}

export interface OfferWallResponse {
  offers: Offer[];
  filters: any;
  display: any;
}