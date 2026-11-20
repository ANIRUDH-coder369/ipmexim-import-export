import { ServiceItem, FAQItem, GalleryItem } from '../types';

export const COMPANY_INFO = {
  name: 'IPM Exim',
  legalStructure: 'Proprietorship',
  tagline: 'Connecting Global Markets. Delivering Quality from India.',
  email: 'ipmexim@gmail.com',
  phone: '+91 (Operational Line - Provided Upon Verified Enquiry)',
  country: 'India',
  operatingPorts: ['Nhava Sheva (JNPT), Mumbai', 'Mundra Port, Gujarat', 'Chennai Port, Tamil Nadu', 'Kolkata Port, West Bengal'],
  socialLinks: {
    facebook: 'https://www.facebook.com/profile.php?id=61595076975177',
    instagram: 'https://www.instagram.com/ipmexim/',
    linkedin: 'https://www.linkedin.com/in/mayuri-kotambe-b88407444/',
    indiamart: 'https://buyer.indiamart.com/?tabname=profile',
  },
  description: 'IPM Exim is an India-based international export-import and product sourcing house. We bridge overseas B2B buyers—including importers, wholesalers, distributors, and institutional clients—with certified Indian manufacturers and agricultural producers through transparent specification management, rigorous quality oversight, and coordinated freight fulfillment.',
  commitments: [
    {
      title: 'Buyer-Focused Product Sourcing',
      description: 'We assess exact commercial grades, varieties, and technical specifications directly with verified Indian manufacturers to match international market expectations.',
    },
    {
      title: 'Clear & Traceable Specifications',
      description: 'Every quotation is backed by verified parameters including moisture content, HS codes, purity thresholds, and sample conformity.',
    },
    {
      title: 'Responsive & Transparent Communication',
      description: 'Direct dialogue with dedicated trade coordinators who provide honest timeline estimates, crop updates, and candid pricing breakdowns.',
    },
    {
      title: 'Packaging & Private-Label Coordination',
      description: 'Custom packaging tailored to ocean or air transit, complying with destination country labeling regulations, barcoding, and moisture protection.',
    },
    {
      title: 'Documentation & Regulatory Support',
      description: 'Assistance coordinating Certificate of Origin, Phytosanitary inspection, Fumigation certificates, Bill of Lading, and commercial invoices.',
    },
    {
      title: 'Independent Inspection Coordination',
      description: 'Coordination of pre-shipment container inspections and laboratory analyses via recognized testing agencies (e.g. SGS, Bureau Veritas) as agreed in trade terms.',
    },
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'export-supply',
    title: '1. Export Supply Coordination',
    shortDescription: 'End-to-end management of export consignments from verified Indian sources to international ports.',
    fullDescription: 'We manage full container load (FCL) and consolidated less-than-container load (LCL) export arrangements. From contract finalization and producer scheduling to warehouse dispatch and container stuffing, we ensure your goods transition smoothly from Indian origin to overseas destinations.',
    keyBenefits: [
      'Comprehensive scheduling oversight',
      'Minimization of transit demurrage risks',
      'Port dispatch and container seal verification',
    ],
    deliverables: [
      'Production timeline schedule',
      'Stuffing & dispatch photographic report',
      'Complete export shipping document pack',
    ],
  },
  {
    id: 'import-sourcing',
    title: '2. Import Product Sourcing',
    shortDescription: 'Assisting international buyers and domestic clients in identifying and evaluating cross-border product flows.',
    fullDescription: 'Leveraging established commercial trade ties, we assist buyers in matching demand requirements with reputable, solvent suppliers across India and regional trade corridors, verifying supplier credentials and commercial viability prior to commitment.',
    keyBenefits: [
      'Pre-vetted supplier contacts',
      'Comparative pricing analysis',
      'Mitigated cross-border transaction risks',
    ],
    deliverables: [
      'Supplier suitability dossier',
      'Price benchmark report',
      'Commercial terms negotiation framework',
    ],
  },
  {
    id: 'supplier-identification',
    title: '3. Indian Supplier Identification',
    shortDescription: 'Locating specialized regional manufacturers, farming clusters, and artisanal cooperatives across India.',
    fullDescription: 'India spans diverse agricultural regions and manufacturing belts. We identify specialized producers—from high-curcumin turmeric clusters in Tamil Nadu to brassware craftsmen in Moradabad—ensuring direct access to authentic regional origins without middlemen inflation.',
    keyBenefits: [
      'Access to primary manufacturing belts',
      'Direct pricing without speculative layer markups',
      'Verification of factory capabilities',
    ],
    deliverables: [
      'Regional sourcing map',
      'Factory/cluster verification summary',
      'Initial sample acquisition',
    ],
  },
  {
    id: 'custom-product-sourcing',
    title: '4. Custom Product Sourcing',
    shortDescription: 'Developing tailor-made specifications, custom recipes, finishes, or engineered dimensions.',
    fullDescription: 'When off-the-shelf commodities do not satisfy your market, we coordinate customized product manufacturing. Whether you require specific thread counts for luxury textiles, custom-stamped copperware dimensions, or specific moisture and granulation levels in spices, we liaise directly with producers to prototype and produce exact batches.',
    keyBenefits: [
      'Bespoke production to client drawings/recipes',
      'Sample iteration and approval before bulk run',
      'Private label and OEM packaging customization',
    ],
    deliverables: [
      'Technical specification agreement',
      'Pre-production prototype approval',
      'Production sign-off protocol',
    ],
  },
  {
    id: 'specification-coordination',
    title: '5. Product Specification Coordination',
    shortDescription: 'Aligning international buyer quality standards with Indian production capabilities and test parameters.',
    fullDescription: 'Misunderstandings regarding quality tolerances lead to trade disputes. We establish written technical specification matrices—including maximum moisture, volatile oil percentages, sizing tolerances, and chemical purity benchmarks—signed by both buyer and supplier before contract execution.',
    keyBenefits: [
      'Zero ambiguity on acceptance criteria',
      'Standardized testing methodologies',
      'Objective quality verification',
    ],
    deliverables: [
      'Bilingual or standardized Specification Sheet',
      'Certificate of Analysis (COA) cross-reference',
      'Acceptance criteria protocol',
    ],
  },
  {
    id: 'packaging-labelling',
    title: '6. Packaging & Labelling Coordination',
    shortDescription: 'Export-grade packaging design, barrier protection, barcoding, and destination country compliance.',
    fullDescription: 'Export journeys involve humidity, temperature fluctuations, and rough container handling. We coordinate ISPM-15 compliant palletization, heavy-duty barrier pouches, desiccants, multilingual carton printing, and GS1-compatible barcodes to ensure shipments arrive intact and compliant with destination retail laws.',
    keyBenefits: [
      'Damage prevention during sea and air transit',
      'Custom branding and barcoding for quick retail shelving',
      'Compliance with EU, US, and Middle East labeling rules',
    ],
    deliverables: [
      'Packaging approval proof sheet',
      'Pallet configuration plan',
      'Carton marking and barcode verification',
    ],
  },
  {
    id: 'quality-inspection',
    title: '7. Quality Inspection Coordination',
    shortDescription: 'Arranging third-party laboratory testing and pre-shipment container loading inspections.',
    fullDescription: 'We coordinate pre-shipment inspections through internationally recognized testing agencies (such as SGS, Bureau Veritas, or Intertek) or accredited Indian laboratories per buyer mandate. Verifies physical parameters, weight, microbiological counts, and pesticide residues prior to release.',
    keyBenefits: [
      'Independent verification before balance payment release',
      'Transparent photographic loading logs',
      'Confidence for international institutional buyers',
    ],
    deliverables: [
      'Third-party Inspection Certificate (when contracted)',
      'Pre-shipment photo & video logs',
      'Laboratory Test Reports',
    ],
  },
  {
    id: 'export-documentation',
    title: '8. Export Documentation Support',
    shortDescription: 'Preparation and coordination of all international trade documentation, licenses, and certificates.',
    fullDescription: 'International customs requires meticulous documentation. We support the coordination of Commercial Invoices, Packing Lists with container manifests, Bills of Lading / Airway Bills, Certificates of Origin, Phytosanitary Certificates, Fumigation Certificates, and consular legalizations.',
    keyBenefits: [
      'Prompt documentation release to avoid port demurrage',
      'Accurate HS code classification',
      'Smooth customs clearance at destination port',
    ],
    deliverables: [
      'Draft documentation pack for buyer review',
      'Final negotiable and non-negotiable sets',
      'Courier tracking of original documents',
    ],
  },
  {
    id: 'shipment-coordination',
    title: '9. Shipment & Logistics Coordination',
    shortDescription: 'Liaison with licensed freight forwarders and ocean/air carriers for competitive transit arrangements.',
    fullDescription: 'We work closely with reputed international shipping lines and multimodal logistics providers to book container space, arrange inland container depot (ICD) movement, verify container seal integrity, and provide live transit milestone updates until arrival at the destination port of discharge.',
    keyBenefits: [
      'Optimal freight routing and transit time',
      'Container loading supervision',
      'Proactive vessel tracking and delay notification',
    ],
    deliverables: [
      'Booking confirmation and sailing schedule',
      'Vessel tracking milestone updates',
      'Arrival notice advisory',
    ],
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do I request an official commercial quotation from IPM Exim?',
    answer: 'You can submit your requirements via our website quotation form or email ipmexim@gmail.com with your required product name, estimated quantity (metric tons, containers, or units), desired incoterms (FOB, CIF, CFR), and target destination port. We will review the specifications and provide an itemized commercial quotation.',
    category: 'Quotation',
  },
  {
    question: "What are IPM Exim's typical Minimum Order Quantities (MOQ)?",
    answer: 'MOQs depend on the product category. For agricultural bulk commodities (such as Basmati rice or sesame seeds), standard MOQs start at one 20ft Full Container Load (approx. 18 to 25 Metric Tons). For high-value spices, air consignments from 250 kg are possible. For textiles, MOQs start around 300 meters, and for handcrafted copperware, 100 pieces per design.',
    category: 'Orders',
  },
  {
    question: 'Are product samples available before placing a commercial order?',
    answer: 'Yes. Product samples can be arranged for quality evaluation, laboratory testing, and physical inspection. Sample cost and international courier charges (via DHL or FedEx) are generally borne by the prospective buyer and credited back against the first confirmed commercial order.',
    category: 'Samples',
  },
  {
    question: 'Can IPM Exim accommodate custom packaging and private labelling?',
    answer: 'Yes. We frequently coordinate custom buyer-branded packaging including retail pouches, branded corrugated cartons, printed jute or BOPP bags, and customized barcoding, subject to minimum order thresholds for printed packaging material.',
    category: 'Packaging',
  },
  {
    question: 'What payment terms are accepted for international trade?',
    answer: 'Standard international B2B payment terms include Irrevocable Letter of Credit at sight (L/C at Sight) confirmed by a first-class international bank, or Telegraphic Transfer (T/T) with an agreed advance deposit and balance against draft shipping documents, depending on mutual agreement and credit evaluation.',
    category: 'Payment',
  },
  {
    question: 'How does IPM Exim ensure product quality and specification compliance?',
    answer: 'We operate a four-step sourcing protocol: preliminary specification alignment, manufacturer batch audits, pre-shipment sampling, and optional third-party independent inspection (SGS, Bureau Veritas, etc.) at the loading port before container sealing.',
    category: 'Quality',
  },
  {
    question: 'Which Indian export ports do you primarily ship through?',
    answer: 'We coordinate shipments through India’s major maritime gateway ports, primarily Nhava Sheva (JNPT) and Mumbai Port on the west coast, Mundra Port in Gujarat, Chennai and Tuticorin on the east coast, and Kolkata/Haldia for eastern regional commodities.',
    category: 'Logistics',
  },
  {
    question: 'What trade documents are provided with each export consignment?',
    answer: 'Every export consignment is accompanied by a Commercial Invoice, Packing List, Bill of Lading (or Airway Bill), Certificate of Origin, and category-specific documentation such as Phytosanitary Certificate, Fumigation Certificate, or Certificate of Analysis (COA).',
    category: 'Documentation',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Deep Ocean Freight & Port Coordination',
    category: 'Logistics',
    imageUrl: '/images/hero_global_trade_1793609365586.jpg',
    caption: 'Global container vessel operations connecting major Indian trade gateways with international ports of discharge.',
  },
  {
    id: 'gal-2',
    title: 'Graded Indian Whole Spices & Seeds',
    category: 'Products',
    imageUrl: '/images/product_spices_export_1793609366204.jpg',
    caption: 'Sun-dried Alleppey green cardamom, star anise, black pepper, and cinnamon quills sorted by diameter and aroma profile.',
  },
  {
    id: 'gal-3',
    title: 'Textile Weaving & Fine Fabric Rolls',
    category: 'Packaging',
    imageUrl: '/images/product_textiles_luxury_1793609366515.jpg',
    caption: 'Rolls of mulberry silk and combed organic cotton packaged in moisture-barrier export poly-tubes with protective headers.',
  },
  {
    id: 'gal-4',
    title: 'Artisanal Hammered Copper & Brassware',
    category: 'Products',
    imageUrl: '/images/product_handicrafts_brass_1793609366491.jpg',
    caption: 'Bespoke hand-hammered pure copper vessels with anti-tarnish protective lacquers crafted for international hospitality clients.',
  },
  {
    id: 'gal-5',
    title: 'Export Laboratory Quality Verification',
    category: 'Quality',
    imageUrl: '/images/quality_inspection_lab_1793609366265.jpg',
    caption: 'Accredited laboratory analysis checking moisture percentages, seed purity, and physical parameters against international buyer tolerances.',
  },
];
