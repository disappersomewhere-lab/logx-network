import {catalog, type Locale, type Product, type ProductCategory} from '@/lib/catalog';

type Copy = Record<Locale, string>;

/**
 * Deck copy. English follows the reference profile word for word (one typo,
 * "Our products epitomizes", corrected); the copper and components
 * introductions have no counterpart there and are written from the catalogue.
 */
export const deckCopy = {
  coverTitle: {en: 'Profile & Catalogue', ar: 'الملف التعريفي والكتالوج'},
  welcome: {en: 'Welcome', ar: 'أهلاً بكم'},
  tagline: {en: 'Where Excellence Meets Innovation', ar: 'حيث يلتقي التميّز بالابتكار'},

  aboutTitle: {en: 'About Us', ar: 'من نحن'},
  aboutBody: {
    en: 'where excellence meets innovation in high-quality data connectivity. Our products epitomize cutting-edge technology, offering a diverse array of top-tier products to fulfill all your data connection requirements. From high-performance Ethernet cables to precision-engineered keystone jacks, robust patch cords, versatile faceplates with modules, reliable patch panels, efficient cable management solutions, and a comprehensive suite of fiber optic cables and components, LOGX NETWORK ensures your data transmission is seamless, reliable, and always up to the mark.',
    ar: 'حيث يلتقي التميّز بالابتكار في توصيل البيانات عالي الجودة. تجسّد منتجاتنا أحدث ما وصلت إليه التقنية، وتقدّم مجموعة متنوعة من المنتجات المتميزة لتلبية جميع متطلبات توصيل البيانات لديك. من كابلات الإيثرنت عالية الأداء إلى مقابس Keystone المصمّمة بدقة، ووصلات التوصيل المتينة، والأوجه متعددة الاستخدامات مع وحداتها، ولوحات التوصيل الموثوقة، وحلول إدارة الكابلات الفعّالة، ومجموعة متكاملة من كابلات الألياف الضوئية ومكوّناتها، تضمن LOGX NETWORK نقل بياناتك بسلاسة وموثوقية وبأعلى مستوى دائماً.'
  },
  hallmarkReliable: {en: 'Reliable. High-Performance', ar: 'موثوقية وأداء عالٍ'},
  hallmarkEco: {en: 'Environmentally Friendly', ar: 'صديقة للبيئة'},

  missionTitle: {en: 'Our Mission', ar: 'مهمتنا'},
  commitmentTitle: {en: 'Our Commitment', ar: 'التزامنا'},
  missionBody: {
    en: 'At LOGX NETWORK we are committed to providing products that stand out for their quality, durability, and reliability. Our goal is to empower businesses and individuals with the best-in-class connectivity solutions that support their growing data needs.',
    ar: 'نلتزم في LOGX NETWORK بتقديم منتجات تتميّز بالجودة والمتانة والموثوقية. وهدفنا تمكين المؤسسات والأفراد بأفضل حلول التوصيل التي تدعم احتياجاتهم المتنامية من البيانات.'
  },
  commitmentBody: {
    en: 'LOGX NETWORK is dedicated to delivering excellence in every product we offer. We continuously innovate to meet the evolving demands of the industry, ensuring that our customers always have access to the latest and most reliable connectivity solutions.',
    ar: 'تكرّس LOGX NETWORK جهودها لتحقيق التميّز في كل منتج نقدّمه. ونبتكر باستمرار لمواكبة متطلبات القطاع المتجددة، لنضمن لعملائنا الوصول الدائم إلى أحدث حلول التوصيل وأكثرها موثوقية.'
  },

  whyTitle: {en: 'Why Choose', ar: 'لماذا تختار'},
  why: [
    {
      icon: 'quality',
      title: {en: 'Best Quality', ar: 'أفضل جودة'},
      body: {
        en: 'Our products are manufactured to the highest standards, ensuring top performance and longevity.',
        ar: 'تُصنَّع منتجاتنا وفق أعلى المعايير، لتضمن أفضل أداء وعمراً تشغيلياً طويلاً.'
      }
    },
    {
      icon: 'warranty',
      title: {en: 'Great Warranty', ar: 'ضمان مميّز'},
      body: {
        en: 'We offer a "no questions asked" direct replacement warranty, providing peace of mind and confidence in our products.',
        ar: 'نقدّم ضمان استبدال مباشر «دون أي أسئلة»، يمنحك راحة البال والثقة في منتجاتنا.'
      }
    },
    {
      icon: 'durability',
      title: {en: 'Durability and Reliability', ar: 'المتانة والموثوقية'},
      body: {
        en: 'Built to withstand the rigors of daily use, our products guarantee dependable connections.',
        ar: 'صُمّمت منتجاتنا لتتحمّل ظروف الاستخدام اليومي الشاق، وتضمن اتصالات يُعتمد عليها.'
      }
    },
    {
      icon: 'availability',
      title: {en: 'Availability', ar: 'التوفّر'},
      body: {
        en: 'Our products are always in stock and ready for immediate purchase at our showroom.',
        ar: 'منتجاتنا متوفرة دائماً في المخزون وجاهزة للشراء الفوري من صالة العرض.'
      }
    }
  ],

  categoriesTitle: {en: 'Our Categories', ar: 'فئاتنا'},
  productListTitle: {en: 'Product List', ar: 'قائمة المنتجات'},

  locationsTitle: {en: 'Our Locations', ar: 'مواقعنا'},
  contactTitle: {en: 'Contact', ar: 'تواصل'},
  contactAccent: {en: 'Us', ar: 'معنا'},

  lengths: {en: 'Lengths', ar: 'الأطوال'},
  partNumber: {en: 'P/N', ar: 'رقم القطعة'},
  variants: {en: 'part numbers', ar: 'أرقام قطع'}
} as const satisfies Record<string, unknown>;

export type WhyIcon = (typeof deckCopy.why)[number]['icon'];

/**
 * The reference deck's three categories, in its order. `id` maps onto the
 * catalogue's categories; the reference calls the accessories "Components".
 */
export const deckCategories: {
  id: ProductCategory;
  title: Copy;
  summary: Copy;
  intro: Copy;
  /** Circular shot on the categories slide. */
  thumb: string;
  /** Two shots on the category's introduction slide. */
  photos: [string, string];
}[] = [
  {
    id: 'fiber',
    title: {en: 'Fiber Optic', ar: 'الألياف الضوئية'},
    summary: {
      en: 'High-speed, reliable connections with minimal signal loss, perfect for any network size.',
      ar: 'اتصالات سريعة وموثوقة بأدنى فقد للإشارة، مثالية لأي حجم من الشبكات.'
    },
    intro: {
      en: "Our fiber optic products are designed to deliver the highest speeds and most reliable connections for your network. These include a wide range of fiber optic cables and components, such as connectors, adapters, and transceivers, all crafted to ensure optimal performance and minimal signal loss. Whether you're building a backbone for a large enterprise or setting up a small office network, our fiber optic solutions provide the robust infrastructure needed for high-speed data transmission.",
      ar: 'صُمّمت منتجات الألياف الضوئية لدينا لتقديم أعلى السرعات وأكثر الاتصالات موثوقية لشبكتك. وتشمل مجموعة واسعة من كابلات الألياف الضوئية ومكوّناتها، مثل الموصلات والمحوّلات وأجهزة الإرسال والاستقبال، وجميعها مصنوعة لضمان الأداء الأمثل وأدنى فقد للإشارة. وسواء كنت تبني شبكة أساسية لمؤسسة كبيرة أو تجهّز شبكة مكتب صغير، توفّر حلول الألياف الضوئية لدينا البنية التحتية المتينة اللازمة لنقل البيانات بسرعة عالية.'
    },
    thumb: '/profile/category-fiber.webp',
    photos: ['/profile/fiber-connectors.webp', '/profile/fiber-cord.webp']
  },
  {
    id: 'copper',
    title: {en: 'Copper Cables', ar: 'الكابلات النحاسية'},
    summary: {
      en: 'Durable cables for various applications, providing stable and fast data transfer.',
      ar: 'كابلات متينة لمختلف التطبيقات، توفّر نقلاً مستقراً وسريعاً للبيانات.'
    },
    intro: {
      en: "Our copper cabling range is built for stable, fast data transfer across every kind of installation. It covers CAT6 and CAT6A installation cable on 305 m boxes, in unshielded U/UTP and fully shielded S/FTP, alongside factory-terminated CAT6 and CAT6A patch cords from 0.25 m to 10 m with gold-plated RJ45 contacts. Whether you're cabling a new office floor or upgrading links to 10G, our copper solutions deliver dependable performance from the wall outlet to the rack.",
      ar: 'صُمّمت مجموعة الكابلات النحاسية لدينا لنقل البيانات بثبات وسرعة في جميع أنواع التمديدات. وتشمل كابلات التمديد CAT6 وCAT6A في صناديق بطول 305 أمتار، بنوعيها غير المدرّع U/UTP والمدرّع بالكامل S/FTP، إلى جانب وصلات توصيل CAT6 وCAT6A مجهّزة في المصنع بأطوال من 0.25 إلى 10 أمتار بموصلات RJ45 مطلية بالذهب. وسواء كنت تمدّد شبكة لطابق مكاتب جديد أو ترقّي الروابط إلى 10G، توفّر حلولنا النحاسية أداءً يُعتمد عليه من مقبس الجدار حتى الخزانة.'
    },
    thumb: '/profile/category-copper.webp',
    photos: ['/profile/category-copper.webp', '/products/photos/cat6-cable-01.webp']
  },
  {
    id: 'accessories',
    title: {en: 'Components', ar: 'المكوّنات'},
    summary: {
      en: 'Essential items like keystone jacks, patch cords, faceplates, patch panels, and cable management solutions for an efficient and organized network.',
      ar: 'عناصر أساسية مثل مقابس Keystone ووصلات التوصيل والأوجه ولوحات التوصيل وحلول إدارة الكابلات، لشبكة فعّالة ومنظّمة.'
    },
    intro: {
      en: 'Our components bring order and efficiency to every network. The range includes toolless CAT6 and CAT6A keystone jacks, 86-type faceplates, 24- and 48-port keystone patch panels, 1U and 2U metal cable managers, RJ45 plugs and boots, SFP media converters, a rack-mount PDU and a complete installation tool kit: everything needed to terminate, patch and manage a clean, organized installation.',
      ar: 'تضفي مكوّناتنا التنظيم والكفاءة على كل شبكة. وتشمل المجموعة مقابس Keystone من فئتي CAT6 وCAT6A تُركَّب دون أدوات، وأوجه قياس 86، ولوحات توصيل Keystone بسعة 24 و48 منفذاً، ومنظّمات كابلات معدنية 1U و2U، وقوابس RJ45 وأغطيتها، ومحوّلات وسائط SFP، ووحدة توزيع طاقة للخزانة، وحقيبة أدوات تركيب متكاملة: كل ما تحتاجه لإنهاء التوصيلات وتنظيمها في تمديد نظيف ومرتّب.'
    },
    thumb: '/profile/category-components.webp',
    photos: ['/profile/category-components.webp', '/products/photos/keystone-cat6a-01.webp']
  }
];

/** Where the two offices sit on public/profile/world-map.svg, in percent. */
export const deckLocations = [
  {
    id: 'uk',
    role: {en: 'HQ', ar: 'المقر الرئيسي'},
    place: {en: 'London, UK', ar: 'لندن، المملكة المتحدة'},
    company: {en: 'LOGX NETWORKS LTD', ar: 'LOGX NETWORKS LTD'},
    x: 46.5,
    y: 32.2
  },
  {
    id: 'sa',
    role: {en: 'Main Distributor', ar: 'الموزّع الرئيسي'},
    place: {en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية'},
    company: {en: 'Networks Sea Co.', ar: 'شركة بحر الشبكات'},
    x: 58.8,
    y: 50
  }
] as const;

export type ProductCard = {
  key: string;
  title: string;
  image: string;
  href: string;
  details: string[];
};

// Length variants ("…, 0.5 m", "… — 1 متر") are one product on the page.
const EN_LENGTH = /,\s*[\d.]+\s*m$/;
const AR_LENGTH = /\s*—\s*[\d.]+\s*متر$/;
const isLength = (product: Product, index: number) => product.specs[index].label.en === 'Length';

/**
 * One card per product, with length variants folded into a single card that
 * lists the lengths — the reference's product list shows a name, a photo and
 * four lines of details.
 */
export function productCardsFor(category: ProductCategory, locale: Locale): ProductCard[] {
  const groups = new Map<string, Product[]>();
  for (const product of catalog) {
    if (product.category !== category) continue;
    const key = product.name.en.replace(EN_LENGTH, '');
    groups.set(key, [...(groups.get(key) ?? []), product]);
  }

  return [...groups.entries()].map(([key, products]) => {
    const [first] = products;
    const details = first.specs
      .filter((_, index) => !isLength(first, index))
      .slice(0, 3)
      .map((spec) => `${spec.label[locale]}: ${spec.value[locale]}`);

    if (products.length > 1) {
      const lengths = products
        .map((product) => product.specs.find((spec) => spec.label.en === 'Length')?.value.en)
        .filter(Boolean)
        .map((value) => value!.replace(/\s*m$/, ''));
      const unit = locale === 'ar' ? 'م' : 'm';
      details.push(
        lengths.length === products.length
          ? `${deckCopy.lengths[locale]}: ${lengths.join(' · ')} ${unit}`
          : `${products.length} ${deckCopy.variants[locale]}`
      );
    } else {
      details.push(`${deckCopy.partNumber[locale]}: ${first.partNumber}`);
    }

    return {
      key,
      title: locale === 'ar' ? first.name.ar.replace(AR_LENGTH, '') : key,
      image: first.images[0],
      href: `/${locale}/products/${first.slug}`,
      details
    };
  });
}

/** Six cards to a product-list slide, as in the reference. */
export function chunk<T>(items: T[], size = 6): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}
