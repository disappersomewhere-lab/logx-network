// Builds data/products.json from the LOGX price list.
//
//   npm run import-products                       # reads data/source/Logx product's.xls
//   npm run import-products -- "other/list.xls"   # or an explicit workbook
//
// The spreadsheet carries only a description and a part number, both written
// for internal use. Each part number is matched to a builder below that turns
// it into a clean bilingual title, a summary and a real specification table.
// The original spreadsheet text is kept on every record as `raw` so nothing is
// lost and the catalogue can always be reconciled against the price list.

import fs from 'node:fs';
import path from 'node:path';
import {familyFor, hasRepresentativePhoto, imagesFor, ogImageFor} from './photo-map.mjs';
import {PRICE_LIST, readRows} from './price-list.mjs';

const ROOT = path.join(import.meta.dirname, '..');

const t = (en, ar) => ({en, ar});
const spec = (labelEn, labelAr, valueEn, valueAr) => ({
  label: t(labelEn, labelAr),
  value: t(valueEn, valueAr)
});

// Part numbers zero-pad short lengths ("...DUS203" is 3 m, not 03 m).
const length = (value) => String(Number(value));

// Formats "0.5" as "0.5 m" and "10" as "10 m", in both languages.
const metres = (value) => t(`${value} m`, `${value} متر`);

// Arabic counts a noun in the plural from 3 to 10 and in the accusative
// singular from 11 up, so "8 ألياف" but "12 ليفاً".
const arCount = (count, plural, singular) =>
  `${count} ${count >= 3 && count <= 10 ? plural : singular}`;

const FLUKE = spec('Testing', 'الاختبار', 'Fluke channel test passed', 'اجتياز اختبار Fluke');
const RJ45_GOLD = spec(
  'Contacts',
  'الموصلات',
  'RJ45, gold-plated pins',
  'RJ45 بأطراف مطلية بالذهب'
);

// Each builder claims a part number and returns the catalogue copy for it.
// First match wins, so put narrower patterns first.
const builders = [
  {
    match: /^LXC6UUPVG305$/,
    build: () => ({
      category: 'copper',
      name: t('CAT6 U/UTP LAN Cable, 305 m Box', 'كابل شبكة CAT6 غير مُدرَّع (U/UTP) — صندوق 305 متر'),
      summary: t(
        'Solid bare-copper CAT6 horizontal cable on a 305 m pull box, specified for clean terminations and certified channel performance.',
        'كابل CAT6 أفقي بموصل نحاسي صلب في صندوق سحب سعة 305 متر، مُصمَّم لتوصيلات نظيفة وأداء معتمد للقناة.'
      ),
      specs: [
        spec('Category', 'الفئة', 'CAT6', 'CAT6'),
        spec('Construction', 'التركيب', 'U/UTP, 4 pair, solid', 'U/UTP، 4 أزواج، موصل صلب'),
        spec('Conductor', 'الموصل', 'Bare copper, 0.52 mm (24 AWG)', 'نحاس خالص، 0.52 مم (24 AWG)'),
        spec('Length', 'الطول', '305 m per box', '305 متر لكل صندوق'),
        spec('Jacket', 'الغلاف', 'PVC, grey', 'PVC، رمادي'),
        FLUKE
      ]
    })
  },
  {
    match: /^LXC6AUUPVG305$/,
    build: () => ({
      category: 'copper',
      name: t('CAT6A U/UTP LAN Cable, 305 m Box', 'كابل شبكة CAT6A غير مُدرَّع (U/UTP) — صندوق 305 متر'),
      summary: t(
        'Unshielded CAT6A horizontal cable for 10G links, on a 305 m pull box with a 23 AWG solid copper conductor.',
        'كابل CAT6A أفقي غير مُدرَّع لوصلات 10 جيجابت، في صندوق سحب 305 متر بموصل نحاسي صلب 23 AWG.'
      ),
      specs: [
        spec('Category', 'الفئة', 'CAT6A', 'CAT6A'),
        spec('Construction', 'التركيب', 'U/UTP, 4 pair, solid', 'U/UTP، 4 أزواج، موصل صلب'),
        spec('Conductor', 'الموصل', 'Copper, 0.54 mm (23 AWG)', 'نحاس، 0.54 مم (23 AWG)'),
        spec('Length', 'الطول', '305 m per box', '305 متر لكل صندوق'),
        spec('Jacket', 'الغلاف', 'PVC, grey', 'PVC، رمادي')
      ]
    })
  },
  {
    match: /^LXC6ASFPVG305$/,
    build: () => ({
      category: 'copper',
      name: t('CAT6A S/FTP LAN Cable, 305 m Box', 'كابل شبكة CAT6A مُدرَّع (S/FTP) — صندوق 305 متر'),
      summary: t(
        'Fully shielded CAT6A horizontal cable — foil-screened pairs inside an overall braid — for 10G runs in electrically noisy environments.',
        'كابل CAT6A أفقي مُدرَّع بالكامل — أزواج بغلاف معدني داخل ضفيرة خارجية — لوصلات 10 جيجابت في البيئات ذات التشويش الكهربائي.'
      ),
      specs: [
        spec('Category', 'الفئة', 'CAT6A', 'CAT6A'),
        spec('Construction', 'التركيب', 'S/FTP, 4 pair, shielded', 'S/FTP، 4 أزواج، مُدرَّع'),
        spec('Conductor', 'الموصل', 'Copper, 0.54 mm', 'نحاس، 0.54 مم'),
        spec('Length', 'الطول', '305 m per box', '305 متر لكل صندوق'),
        spec('Jacket', 'الغلاف', 'PVC, grey', 'PVC، رمادي')
      ]
    })
  },
  {
    match: /^LXPC6AUUPVG([\d.]+)$/,
    build: ([, code]) => {
      const len = length(code);
      return {
        category: 'copper',
        name: t(`CAT6A U/UTP Patch Cord, ${len} m`, `وصلة تصحيح CAT6A غير مُدرَّعة — ${len} متر`),
        summary: t(
          `Factory-terminated CAT6A patch cord, ${len} m, on stranded 28 AWG conductors for a flexible, low-profile run in the rack.`,
          `وصلة تصحيح CAT6A مُجهَّزة مصنعياً بطول ${len} متر، بموصلات مجدولة 28 AWG لمرونة أعلى وحجم أصغر داخل الراك.`
        ),
        specs: [
          spec('Category', 'الفئة', 'CAT6A', 'CAT6A'),
          spec('Construction', 'التركيب', 'U/UTP, 4 pair × 28 AWG stranded', 'U/UTP، 4 أزواج × 28 AWG مجدول'),
          spec('Length', 'الطول', ...Object.values(metres(len))),
          RJ45_GOLD,
          spec('Jacket', 'الغلاف', 'PVC, grey', 'PVC، رمادي'),
          FLUKE
        ]
      };
    }
  },
  {
    match: /^LXPC6UUPVG([\d.]+)$/,
    build: ([, code]) => {
      const len = length(code);
      return {
        category: 'copper',
        name: t(`CAT6 U/UTP Patch Cord, ${len} m`, `وصلة تصحيح CAT6 غير مُدرَّعة — ${len} متر`),
        summary: t(
          `Factory-terminated CAT6 patch cord, ${len} m, on stranded 28 AWG conductors for tidy patching between panel and device.`,
          `وصلة تصحيح CAT6 مُجهَّزة مصنعياً بطول ${len} متر، بموصلات مجدولة 28 AWG لتوصيل مرتب بين اللوحة والجهاز.`
        ),
        specs: [
          spec('Category', 'الفئة', 'CAT6', 'CAT6'),
          spec('Construction', 'التركيب', 'U/UTP, 4 pair × 28 AWG stranded', 'U/UTP، 4 أزواج × 28 AWG مجدول'),
          spec('Length', 'الطول', ...Object.values(metres(len))),
          RJ45_GOLD,
          spec('Jacket', 'الغلاف', 'PVC, grey', 'PVC، رمادي'),
          FLUKE
        ]
      };
    }
  },
  {
    match: /^LXA(10|20)$/,
    build: ([, code]) => {
      const ports = code === '10' ? 1 : 2;
      return {
        category: 'accessories',
        name: t(
          `86 Type Faceplate, ${ports} Port`,
          `وجهة تركيب قياس 86 — ${ports === 1 ? 'منفذ واحد' : 'منفذان'}`
        ),
        summary: t(
          `Glossy 86 × 86 mm flush faceplate accepting ${ports} keystone module${ports > 1 ? 's' : ''}, with a labelling window above each port.`,
          `وجهة تركيب مسطحة لامعة بمقاس 86 × 86 مم تستوعب ${ports === 1 ? 'وحدة Keystone واحدة' : 'وحدتَي Keystone'}، مع نافذة تسمية فوق كل منفذ.`
        ),
        specs: [
          spec('Ports', 'عدد المنافذ', String(ports), String(ports)),
          spec('Format', 'المقاس', '86 × 86 mm (86 type)', '86 × 86 مم (قياس 86)'),
          spec('Mounting', 'التركيب', 'Flush, single gang', 'مسطح، علبة مفردة'),
          spec('Finish', 'التشطيب', 'Glossy white', 'أبيض لامع'),
          spec('Module', 'الوحدات', 'Accepts LOGX keystone jacks', 'يستوعب وحدات Keystone من LOGX')
        ]
      };
    }
  },
  {
    match: /^LXCJ6(A?)UFT$/,
    build: ([, augmented]) => {
      const cat = augmented ? 'CAT6A' : 'CAT6';
      return {
        category: 'accessories',
        name: t(`${cat} UTP Keystone Jack, Toolless`, `وحدة Keystone ${cat} غير مُدرَّعة — بدون أدوات`),
        summary: t(
          `${cat} unshielded keystone jack with a 180° straight-through exit and a toolless cap, so a run can be terminated by hand without a punch-down tool.`,
          `وحدة Keystone ${cat} غير مُدرَّعة بمخرج مستقيم 180° وغطاء إغلاق بدون أدوات، ما يتيح إنهاء التوصيل يدوياً دون أداة ضغط.`
        ),
        specs: [
          spec('Category', 'الفئة', cat, cat),
          spec('Shielding', 'التدريع', 'UTP, unshielded', 'UTP، غير مُدرَّع'),
          spec('Termination', 'طريقة التوصيل', 'Toolless', 'بدون أدوات'),
          spec('Exit angle', 'زاوية المخرج', '180° straight through', '180° مستقيم'),
          spec('Compatibility', 'التوافق', 'LOGX faceplates and patch panels', 'وجهات ولوحات توصيل LOGX')
        ]
      };
    }
  },
  {
    match: /^LXCPCMNM([12])$/,
    build: ([, units]) => {
      const u = Number(units);
      const slots = u === 1 ? 24 : 48;
      return {
        category: 'accessories',
        name: t(`${u}U Metal Cable Manager, ${slots} Slot`, `منظم كابلات معدني ${u}U — ${slots} فتحة`),
        summary: t(
          `${u}U front cable manager in powder-coated steel with ${slots} fingers, sized to route a full ${slots}-port panel without straining the cords.`,
          `منظم كابلات أمامي بارتفاع ${u}U من الفولاذ المطلي بالبودرة، بعدد ${slots} فتحة، بمقاس يكفي لتوجيه لوحة بسعة ${slots} منفذاً دون إجهاد الوصلات.`
        ),
        specs: [
          spec('Rack units', 'وحدات الراك', `${u}U`, `${u}U`),
          spec('Slots', 'عدد الفتحات', String(slots), String(slots)),
          spec('Rack width', 'عرض الراك', '19 in', '19 بوصة'),
          spec('Material', 'الخامة', 'Powder-coated steel', 'فولاذ مطلي بالبودرة'),
          spec('Finish', 'اللون', 'Black', 'أسود')
        ]
      };
    }
  },
  {
    match: /^LXPP6U(24|48)\d+$/,
    build: ([, ports]) => {
      const count = Number(ports);
      const u = count === 24 ? 1 : 2;
      return {
        category: 'accessories',
        name: t(
          `${u}U Keystone Patch Panel, ${count} Port`,
          `لوحة توصيل Keystone ${u}U — ${count} منفذاً`
        ),
        summary: t(
          `Unloaded ${count}-port keystone panel, ${u}U, with numbered labelling strips and a rear cable-management bar — populate it with the keystone jacks the job calls for.`,
          `لوحة Keystone فارغة بسعة ${count} منفذاً وارتفاع ${u}U، مع شرائح ترقيم وقضيب لتنظيم الكابلات من الخلف — تُجهَّز بوحدات Keystone حسب متطلبات المشروع.`
        ),
        specs: [
          spec('Ports', 'عدد المنافذ', String(count), String(count)),
          spec('Rack units', 'وحدات الراك', `${u}U`, `${u}U`),
          spec('Loading', 'التجهيز', 'Unloaded (blank)', 'فارغة (غير مُجهَّزة)'),
          spec('Shielding', 'التدريع', 'Unshielded', 'غير مُدرَّعة'),
          spec('Rack width', 'عرض الراك', '19 in', '19 بوصة')
        ]
      };
    }
  },
  {
    match: /^LXCPPTC6$/,
    build: () => ({
      category: 'accessories',
      name: t('RJ45 Strain-Relief Boot', 'غطاء حماية RJ45'),
      summary: t(
        'Snap-on strain-relief boot that protects the RJ45 latch and colour-codes the run. Available in blue, grey, yellow and green.',
        'غطاء حماية ينزلق على القابس لحماية مِزلاج RJ45 وترميز الوصلة بالألوان. متوفر بالأزرق والرمادي والأصفر والأخضر.'
      ),
      specs: [
        spec('Fits', 'يناسب', 'RJ45 modular plugs', 'قوابس RJ45'),
        spec('Colours', 'الألوان', 'Blue, grey, yellow, green', 'أزرق، رمادي، أصفر، أخضر'),
        spec('Function', 'الوظيفة', 'Latch protection and strain relief', 'حماية المِزلاج وتخفيف الإجهاد'),
        spec('Material', 'الخامة', 'PVC', 'PVC')
      ]
    })
  },
  {
    match: /^LXCPUTC6$/,
    build: () => ({
      category: 'accessories',
      name: t('8P8C UTP RJ45 Modular Plug', 'قابس RJ45 معياري 8P8C غير مُدرَّع'),
      summary: t(
        'Unshielded 8P8C modular plug with a 3U gold-plated contact set, for field-terminating CAT6 patch and equipment cords.',
        'قابس معياري 8P8C غير مُدرَّع بأطراف مطلية بالذهب بسماكة 3U، لإنهاء وصلات CAT6 في الموقع.'
      ),
      specs: [
        spec('Format', 'النوع', '8P8C (RJ45)', '8P8C (RJ45)'),
        spec('Shielding', 'التدريع', 'UTP, unshielded', 'UTP، غير مُدرَّع'),
        spec('Plating', 'الطلاء', '3U gold-plated contacts', 'أطراف مطلية بالذهب 3U'),
        spec('Category', 'الفئة', 'CAT6', 'CAT6')
      ]
    })
  },
  {
    match: /^LXCPSTC6A$/,
    build: () => ({
      category: 'accessories',
      name: t('8P8C FTP Shielded RJ45 Plug', 'قابس RJ45 معياري 8P8C مُدرَّع'),
      summary: t(
        'Shielded 8P8C modular plug with a metal body that bonds to the cable screen, for terminating shielded CAT6A cords.',
        'قابس معياري 8P8C مُدرَّع بجسم معدني يتصل بتدريع الكابل، لإنهاء وصلات CAT6A المُدرَّعة.'
      ),
      specs: [
        spec('Format', 'النوع', '8P8C (RJ45)', '8P8C (RJ45)'),
        spec('Shielding', 'التدريع', 'FTP, shielded body', 'FTP، جسم مُدرَّع'),
        spec('Category', 'الفئة', 'CAT6A', 'CAT6A'),
        spec('Bonding', 'الاتصال الأرضي', 'Bonds to cable screen', 'يتصل بتدريع الكابل')
      ]
    })
  },
  {
    match: /^LXFHN047ALS$/,
    build: () => ({
      category: 'fiber',
      name: t('Single-Mode Drop Cable, 4 Core — 1000 m', 'كابل ألياف تفريعي أحادي النمط، 4 ألياف — 1000 متر'),
      summary: t(
        '3.0 mm single-mode drop cable with two FRP strength members, carrying 4 G.657.A1 bend-tolerant fibres on a 1000 m drum.',
        'كابل تفريعي أحادي النمط بقطر 3.0 مم مع عنصرَي تقوية FRP، يحمل 4 ألياف G.657.A1 مقاومة للانحناء على بكرة 1000 متر.'
      ),
      specs: [
        spec('Fibre count', 'عدد الألياف', '4 core', '4 ألياف'),
        spec('Fibre type', 'نوع الليف', 'Single mode, A1 bend tolerant', 'أحادي النمط، A1 مقاوم للانحناء'),
        spec('Cable diameter', 'قطر الكابل', '3.0 mm', '3.0 مم'),
        spec('Strength member', 'عنصر التقوية', '2 × FRP', '2 × FRP'),
        spec('Drum length', 'طول البكرة', '1000 m', '1000 متر')
      ]
    })
  },
  {
    match: /^LXFHS(08|12)7ALS$/,
    build: ([, cores]) => {
      const count = Number(cores);
      return {
        category: 'fiber',
        name: t(
          `Armoured Single-Mode Drop Cable, ${count} Core — 1000 m`,
          `كابل ألياف تفريعي مُدرَّع أحادي النمط، ${arCount(count, 'ألياف', 'ليفاً')} — 1000 متر`
        ),
        summary: t(
          `Light steel-armoured single-tube drop cable carrying ${count} G.657.A1 fibres with two FRP strength members, on a 1000 m drum.`,
          `كابل تفريعي بأنبوب مفرد ومُدرَّع بالفولاذ الخفيف يحمل ${arCount(count, 'ألياف', 'ليفاً')} من نوع G.657.A1 مع عنصرَي تقوية FRP، على بكرة 1000 متر.`
        ),
        specs: [
          spec('Fibre count', 'عدد الألياف', `${count} core`, arCount(count, 'ألياف', 'ليفاً')),
          spec('Fibre type', 'نوع الليف', 'Single mode, A1 bend tolerant', 'أحادي النمط، A1 مقاوم للانحناء'),
          spec('Construction', 'التركيب', 'Single tube, light steel armour', 'أنبوب مفرد، تدريع فولاذي خفيف'),
          spec('Strength member', 'عنصر التقوية', '2 × FRP', '2 × FRP'),
          spec('Drum length', 'طول البكرة', '1000 m', '1000 متر')
        ]
      };
    }
  },
  {
    match: /^LXFPRDLC(\d+)$/,
    build: ([, ports]) => {
      const count = Number(ports);
      const u = count >= 48 ? 2 : 1;
      return {
        category: 'fiber',
        name: t(
          `${count} Port LC Duplex Fiber Patch Panel, ${u}U`,
          `لوحة توصيل ألياف LC مزدوجة ${arCount(count, 'منافذ', 'منفذاً')} — ${u}U`
        ),
        summary: t(
          `Loaded ${u}U optical distribution panel with ${count} LC duplex single-mode adapters, a sliding rail and a splice tray with heat-shrink holders.`,
          `لوحة توزيع بصري مُجهَّزة بارتفاع ${u}U تضم ${count} محول LC مزدوج أحادي النمط، مع مجرى انزلاقي وصينية لحام بحوامل أكمام حرارية.`
        ),
        specs: [
          spec('Ports', 'عدد المنافذ', `${count} × LC duplex`, `${count} × LC مزدوج`),
          spec('Rack units', 'وحدات الراك', `${u}U`, `${u}U`),
          spec('Mode', 'النمط', 'Single mode', 'أحادي النمط'),
          spec('Loading', 'التجهيز', 'Loaded with adapters', 'مُجهَّزة بالمحولات'),
          spec('Includes', 'يشمل', 'Sliding rail, splice tray, heat-shrink holder', 'مجرى انزلاقي، صينية لحام، حامل أكمام حرارية')
        ]
      };
    }
  },
  {
    match: /^LXFCLCLCDUS([23])([\d.]+)$/,
    build: ([, grade, code]) => {
      const len = length(code);
      const multimode = grade === '3';
      const mode = multimode ? 'OM3 multimode' : 'single mode';
      const modeAr = multimode ? 'متعدد النمط OM3' : 'أحادي النمط';
      return {
        category: 'fiber',
        name: t(
          `LC-LC UPC ${multimode ? 'OM3' : 'Single-Mode'} Duplex Patch Cord, ${len} m`,
          `وصلة ألياف LC-LC UPC ${multimode ? 'OM3' : 'أحادية النمط'} مزدوجة — ${len} متر`
        ),
        summary: t(
          `${len} m duplex fibre patch cord, LC-UPC to LC-UPC, on ${mode} fibre with a 2.0 mm PVC jacket.`,
          `وصلة ألياف مزدوجة بطول ${len} متر من LC-UPC إلى LC-UPC، بليف ${modeAr} وغلاف PVC بقطر 2.0 مم.`
        ),
        specs: [
          spec('Connectors', 'الموصلات', 'LC-UPC to LC-UPC, duplex', 'LC-UPC إلى LC-UPC، مزدوج'),
          spec('Mode', 'النمط', multimode ? 'OM3 multimode' : 'Single mode', modeAr),
          spec('Length', 'الطول', ...Object.values(metres(len))),
          spec('Cable diameter', 'قطر الكابل', '2.0 mm', '2.0 مم'),
          spec('Jacket', 'الغلاف', 'PVC', 'PVC')
        ]
      };
    }
  },
  {
    match: /^LXFTLCSU(S2|M3)([\d.]+)$/,
    build: ([, grade, code]) => {
      const len = length(code);
      const multimode = grade === 'M3';
      const modeAr = multimode ? 'متعدد النمط OM3' : 'أحادي النمط';
      return {
        category: 'fiber',
        name: t(
          `LC/UPC ${multimode ? 'OM3' : 'Single-Mode'} Pigtail, ${len} m`,
          `ضفيرة ألياف LC/UPC ${multimode ? 'OM3' : 'أحادية النمط'} — ${len} متر`
        ),
        summary: t(
          `${len} m simplex pigtail on 0.9 mm ${multimode ? 'OM3 multimode' : 'single mode'} fibre, LC/UPC terminated at one end for splicing into a tray.`,
          `ضفيرة أحادية بطول ${len} متر بليف ${modeAr} بقطر 0.9 مم، منتهية بموصل LC/UPC من طرف واحد للحام داخل الصينية.`
        ),
        specs: [
          spec('Connector', 'الموصل', 'LC/UPC, simplex', 'LC/UPC، أحادي'),
          spec('Mode', 'النمط', multimode ? 'OM3 multimode' : 'Single mode', modeAr),
          spec('Length', 'الطول', ...Object.values(metres(len))),
          spec('Fibre diameter', 'قطر الليف', '0.9 mm', '0.9 مم'),
          spec('Jacket', 'الغلاف', 'PVC', 'PVC')
        ]
      };
    }
  },
  {
    match: /^LXFTBLC(\d+)$/,
    build: ([, ports]) => {
      const count = Number(ports);
      return {
        category: 'fiber',
        name: t(
          `${count} Port LC Fiber Terminal Box`,
          `صندوق إنهاء ألياف LC — ${arCount(count, 'منافذ', 'منفذاً')}`
        ),
        summary: t(
          `Wall-mount optical terminal box loaded with ${count} LC single-mode duplex adapters, for terminating a drop cable close to the equipment it feeds.`,
          `صندوق إنهاء بصري للتركيب على الحائط مُجهَّز بـ ${arCount(count, 'محولات', 'محولاً')} LC مزدوجة أحادية النمط، لإنهاء الكابل التفريعي قرب الأجهزة التي يغذيها.`
        ),
        specs: [
          spec('Ports', 'عدد المنافذ', `${count} × LC duplex`, `${count} × LC مزدوج`),
          spec('Mode', 'النمط', 'Single mode', 'أحادي النمط'),
          spec('Loading', 'التجهيز', 'Loaded with adapters', 'مُجهَّز بالمحولات'),
          spec('Mounting', 'التركيب', 'Wall mount', 'تركيب على الحائط')
        ]
      };
    }
  },
  {
    match: /^BT-Tools$/,
    build: () => ({
      category: 'accessories',
      name: t('Network Installation Tool Kit', 'حقيبة أدوات تركيب الشبكات'),
      summary: t(
        'Zipped field kit with the crimping, punch-down, stripping and continuity-testing tools needed to terminate and verify a copper run on site.',
        'حقيبة ميدانية بسحّاب تضم أدوات القرص والضغط والتقشير واختبار الاستمرارية اللازمة لإنهاء وفحص وصلات النحاس في الموقع.'
      ),
      specs: [
        spec('Format', 'النوع', 'Zipped roll-up case', 'حقيبة بسحّاب'),
        spec('Covers', 'الاستخدام', 'Crimp, punch-down, strip, test', 'قرص، ضغط، تقشير، اختبار'),
        spec('Use', 'الاستعمال', 'Copper termination and verification', 'إنهاء وفحص وصلات النحاس')
      ]
    })
  },
  {
    match: /^LGX-MC(1000G|10G)SFP\+?$/,
    build: ([, grade]) => {
      const tenGig = grade === '10G';
      const speed = tenGig ? '10G' : '1G';
      const cage = tenGig ? 'SFP+' : 'SFP';
      return {
        category: 'accessories',
        name: t(`${speed} ${cage} Media Converter`, `محول وسائط ${speed} بمنفذ ${cage}`),
        summary: t(
          `Standalone media converter bridging a ${speed} copper port to an ${cage} optical port, for extending a link beyond the reach of twisted pair.`,
          `محول وسائط مستقل يربط منفذ نحاسي بسرعة ${speed} بمنفذ بصري ${cage}، لتمديد الوصلة إلى ما بعد مدى الكابل النحاسي.`
        ),
        specs: [
          spec('Speed', 'السرعة', speed, speed),
          spec('Optical port', 'المنفذ البصري', `1 × ${cage} cage`, `1 × ${cage}`),
          spec('Copper port', 'المنفذ النحاسي', `1 × RJ45, ${speed}`, `1 × RJ45، ${speed}`),
          spec('Form factor', 'الشكل', 'Standalone desktop unit', 'وحدة مستقلة')
        ]
      };
    }
  },
  {
    match: /^LGX-PDU(\d+)-UK$/,
    build: ([, ways]) => ({
      category: 'accessories',
      name: t(`${ways}-Way UK Socket PDU`, `وحدة توزيع طاقة بـ ${ways} مخارج بريطانية`),
      summary: t(
        `Rack power distribution unit with ${ways} UK sockets and a fitted power cable, for feeding the active equipment in a cabinet from one switched inlet.`,
        `وحدة توزيع طاقة للراك بعدد ${ways} مخارج بريطانية مع كابل تغذية مركّب، لتغذية أجهزة الكابينة من مدخل واحد.`
      ),
      specs: [
        spec('Outlets', 'عدد المخارج', `${ways} × UK socket`, `${ways} × مخرج بريطاني`),
        spec('Rack width', 'عرض الراك', '19 in', '19 بوصة'),
        spec('Supply', 'التغذية', 'Fitted power cable', 'كابل تغذية مركّب'),
        spec('Mounting', 'التركيب', 'Rack mount', 'تركيب في الراك')
      ]
    })
  }
];

function describe(partNumber, raw) {
  for (const {match, build} of builders) {
    const groups = match.exec(partNumber);
    if (groups) return build(groups);
  }
  // No builder claimed it: fall back to the spreadsheet text so the part still
  // appears in the catalogue rather than being silently dropped.
  console.warn(`  ! no builder for ${partNumber} — falling back to the price-list text`);
  const title = raw.replace(/^logx\s*/i, '');
  return {
    category: 'accessories',
    name: t(title, title),
    summary: t(raw, raw),
    specs: [spec('Part number', 'رقم القطعة', partNumber, partNumber)]
  };
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function main() {
  const source = process.argv[2] || PRICE_LIST;
  const products = [];
  for (const {raw, partNumber} of readRows(source)) {
    const {category, name, summary, specs} = describe(partNumber, raw);
    const images = imagesFor(partNumber);
    if (!images.length) console.warn(`  ! no photography mapped for ${partNumber}`);

    products.push({
      slug: `${slugify(name.en)}-${slugify(partNumber)}`,
      partNumber,
      category,
      family: familyFor(partNumber),
      name,
      summary,
      specs: [...specs, spec('Part number', 'رقم القطعة', partNumber, partNumber)],
      images,
      ...(hasRepresentativePhoto(partNumber) ? {representativeImage: true} : {}),
      ogImage: ogImageFor(partNumber),
      raw
    });
  }

  fs.writeFileSync(
    path.join(ROOT, 'data', 'products.json'),
    `${JSON.stringify(products, null, 2)}\n`
  );

  const byCategory = products.reduce((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, {});
  console.log(`Imported ${products.length} products from ${source}`);
  console.log(
    Object.entries(byCategory)
      .map(([category, count]) => `  ${category}: ${count}`)
      .join('\n')
  );
}

main();
