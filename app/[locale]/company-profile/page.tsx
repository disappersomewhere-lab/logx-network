import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import type {CSSProperties, ReactNode} from 'react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import ProfileDeck from '@/components/ProfileDeck';
import ProfileIcon from '@/components/ProfileIcons';
import type {Locale} from '@/lib/catalog';
import {alternatesFor, contact, mailto, offices, productionUrl} from '@/lib/site';
import {companyProfilesFor} from '@/lib/company-profile';
import {chunk, deckCategories, deckCopy, deckLocations, productCardsFor} from '@/lib/profile-deck';
import {locales} from '@/i18n';
import './profile.css';

type Props = {
  params: Promise<{locale: string}>;
};

/** Accent per category, as in the reference decks' category slides. */
const CATEGORY_ACCENT = {
  fiber: '#ef9b1f',
  copper: '#1d8fe1',
  accessories: '#9a8443'
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  return {
    title: t('companyProfile.nav'),
    description: t('companyProfile.description'),
    alternates: alternatesFor(locale, '/company-profile')
  };
}

/** Both artworks; the theme's stylesheet shows the one that suits its ground. */
function DeckLogo({size}: {size: string}) {
  return (
    <span className="pf-logo">
      <Logo size={size} className="pf-logo-ink" />
      <Logo size={size} tone="light" className="pf-logo-light" />
    </span>
  );
}

type SlideProps = {
  kind: string;
  /** Page number in the folio; the cover, welcome and contact slides have none. */
  number?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function Slide({kind, number, className = '', style, children}: SlideProps) {
  return (
    <section className={`pf-slide pf-s-${kind} ${className}`.trim()} style={style}>
      {/* Theme artwork: halftone ribbon, network lattice, or photo and slashes. */}
      <div className="pf-art" aria-hidden="true" />
      <div className="pf-photo" aria-hidden="true" />
      <div className="pf-body">{children}</div>
      {number ? (
        <footer className="pf-folio" data-side={number % 2 ? 'start' : 'end'}>
          <span className="pf-folio-number">{String(number).padStart(2, '0')}</span>
          <span className="pf-folio-rule" />
          <DeckLogo size="0.9em" />
        </footer>
      ) : null}
    </section>
  );
}

export default async function CompanyProfilePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const language = locale as Locale;
  const copy = <K extends keyof typeof deckCopy>(key: K) =>
    (deckCopy[key] as Record<Locale, string>)[language];

  const phone = offices.find((office) => office.id === 'sa')?.phones?.[0];
  const website = `www.${new URL(productionUrl).host}`;

  // Folio numbers run on from About Us (01), as in the reference.
  let page = 0;
  const next = () => ++page;

  return (
    <ProfileDeck
      locale={language}
      pdfs={companyProfilesFor(language)}
      labels={{
        back: t('companyProfile.back'),
        theme: t('companyProfile.theme.label'),
        themes: {
          dark: t('companyProfile.theme.dark'),
          wave: t('companyProfile.theme.wave'),
          mesh: t('companyProfile.theme.mesh')
        },
        print: t('companyProfile.print'),
        download: t('companyProfile.download')
      }}
    >
      {/* ------------------------------------------------------------- cover */}
      <Slide kind="cover">
        <div className="pf-cover-mark">
          <DeckLogo size="5.6em" />
          <h1 className="pf-cover-title">{copy('coverTitle')}</h1>
          <p className="pf-cover-year">{new Date().getFullYear()}</p>
        </div>
      </Slide>

      {/* ----------------------------------------------------------- welcome */}
      <Slide kind="welcome">
        <h2 className="pf-welcome-word">{copy('welcome')}</h2>
        <p className="pf-welcome-tagline">{copy('tagline')}</p>
      </Slide>

      {/* ---------------------------------------------------------- about us */}
      <Slide kind="about" number={next()}>
        <h2 className="pf-title">{copy('aboutTitle')}</h2>
        <p className="pf-about-body">
          <DeckLogo size="1.9em" /> {copy('aboutBody')}
        </p>
        <ul className="pf-hallmarks">
          <li>
            <span className="pf-badge">
              <ProfileIcon name="reliable" />
            </span>
            {copy('hallmarkReliable')}
          </li>
          <li>
            <span className="pf-badge">
              <ProfileIcon name="eco" />
            </span>
            {copy('hallmarkEco')}
          </li>
        </ul>
      </Slide>

      {/* ------------------------------------------------ mission & commitment */}
      <Slide kind="mission" number={next()}>
        <div className="pf-pillars">
          <div className="pf-pillar">
            <h3 className="pf-pill">{copy('missionTitle')}</h3>
            <p>{copy('missionBody')}</p>
          </div>
          <div className="pf-pillar pf-pillar-alt">
            <h3 className="pf-pill">{copy('commitmentTitle')}</h3>
            <p>{copy('commitmentBody')}</p>
          </div>
        </div>
      </Slide>

      {/* -------------------------------------------------------- why choose */}
      <Slide kind="why" number={next()}>
        <h2 className="pf-title">
          {copy('whyTitle')} <DeckLogo size="1.15em" />
        </h2>
        <div className="pf-why">
          {deckCopy.why.map((item) => (
            <div className="pf-why-item" key={item.icon}>
              <span className="pf-badge">
                <ProfileIcon name={item.icon} />
              </span>
              <h3>{item.title[language]}</h3>
              <p>{item.body[language]}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* -------------------------------------------------------- categories */}
      <Slide kind="categories" number={next()}>
        <h2 className="pf-title">{copy('categoriesTitle')}</h2>
        <div className="pf-categories">
          {deckCategories.map((category) => (
            <a
              href={`/${locale}/products?category=${category.id}`}
              className="pf-category"
              key={category.id}
              style={{'--accent': CATEGORY_ACCENT[category.id]} as CSSProperties}
            >
              <span className="pf-category-thumb">
                <Image src={category.thumb} alt="" fill sizes="240px" />
              </span>
              <h3>{category.title[language]}</h3>
              <p>{category.summary[language]}</p>
            </a>
          ))}
        </div>
      </Slide>

      {/* ----------------------------------- per category: intro + product list */}
      {deckCategories.flatMap((category) => {
        const accent = {'--accent': CATEGORY_ACCENT[category.id]} as CSSProperties;
        const pages = chunk(productCardsFor(category.id, language));

        return [
          <Slide kind="intro" number={next()} style={accent} key={`${category.id}-intro`}>
            <h2 className="pf-intro-title">{category.title[language]}</h2>
            <p className="pf-intro-body">{category.intro[language]}</p>
            <div className="pf-intro-photos">
              {category.photos.map((src) => (
                <span className="pf-intro-photo" key={src}>
                  <Image src={src} alt="" fill sizes="(max-width: 760px) 90vw, 520px" />
                </span>
              ))}
            </div>
          </Slide>,
          ...pages.map((cards, index) => (
            <Slide kind="list" number={next()} style={accent} key={`${category.id}-list-${index}`}>
              <h2 className="pf-title">
                {copy('productListTitle')}
                <small>
                  {category.title[language]}
                  {pages.length > 1 ? ` · ${index + 1}/${pages.length}` : ''}
                </small>
              </h2>
              <div className="pf-products">
                {cards.map((card) => (
                  <a href={card.href} className="pf-product" key={card.key}>
                    <span className="pf-product-name">{card.title}</span>
                    <span className="pf-product-photo">
                      <Image src={card.image} alt="" fill sizes="(max-width: 760px) 45vw, 240px" />
                    </span>
                    <span className="pf-product-details">
                      {card.details.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </span>
                  </a>
                ))}
              </div>
            </Slide>
          ))
        ];
      })}

      {/* --------------------------------------------------------- locations */}
      <Slide kind="locations" number={next()}>
        <h2 className="pf-title">{copy('locationsTitle')}</h2>
        <div className="pf-map">
          {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG; next/image adds nothing */}
          <img src="/profile/world-map.svg" alt="" />
          {deckLocations.map((place) => (
            <div
              className="pf-pin"
              data-pin={place.id}
              key={place.id}
              style={{insetInlineStart: `${locale === 'ar' ? 100 - place.x : place.x}%`, top: `${place.y}%`}}
            >
              <span className="pf-pin-dot" />
              <span className="pf-pin-tag">
                <span className="pf-pin-role">{place.role[language]}</span>
                <strong>{place.place[language]}</strong>
                <span>{place.company[language]}</span>
              </span>
            </div>
          ))}
        </div>
      </Slide>

      {/* ----------------------------------------------------------- contact */}
      <Slide kind="contact">
        <h2 className="pf-contact-title">
          {copy('contactTitle')} <em>{copy('contactAccent')}</em>
        </h2>
        <ul className="pf-contact-lines">
          {phone ? (
            <li>
              <ProfileIcon name="phone" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} dir="ltr">
                {phone}
              </a>
            </li>
          ) : null}
          <li>
            <ProfileIcon name="mail" />
            <a href={mailto()} dir="ltr">
              {contact.email}
            </a>
          </li>
          <li>
            <ProfileIcon name="globe" />
            <a href={productionUrl} dir="ltr">
              {website}
            </a>
          </li>
        </ul>
      </Slide>
    </ProfileDeck>
  );
}
