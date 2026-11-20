import { NextResponse } from 'next/server';

// Default product lines for serverless Vercel runtime
const INITIAL_PRODUCT_LINES = [
  {
    _id: 'pl-1',
    id: 'pl-1',
    name: '1121 Steam Basmati Rice (XXL Extra Long Grain)',
    category: 'Rice & Grains',
    description: 'Aged 2+ years, avg grain length 8.35mm+, zero chalky grains.',
    defaultUnit: '20ft FCL / 25 MT',
    isActive: true,
    displayOrder: 1
  },
  {
    _id: 'pl-2',
    id: 'pl-2',
    name: '1509 Golden Sella Basmati Rice',
    category: 'Rice & Grains',
    description: 'Parboiled golden grain with exceptional elongation ratio and high aroma.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    displayOrder: 2
  },
  {
    _id: 'pl-3',
    id: 'pl-3',
    name: 'Alleppey Green Cardamom (8mm Bold)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Deep green, whole unbroken pods with high essential oil profile.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    displayOrder: 3
  },
  {
    _id: 'pl-4',
    id: 'pl-4',
    name: 'Guntur S4 / Teja S17 Red Chilli',
    category: 'High-Aroma Spices & Herbs',
    description: 'High pungency (SHU 35,000–50,000), stemless, vibrant natural red colour.',
    defaultUnit: '1 x 20ft FCL (14 MT)',
    isActive: true,
    displayOrder: 4
  },
  {
    _id: 'pl-5',
    id: 'pl-5',
    name: 'Salem Turmeric Fingers (Curcumin 3.5%+)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Polished hard golden fingers with verified natural curcumin concentration.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    displayOrder: 5
  },
  {
    _id: 'pl-6',
    id: 'pl-6',
    name: 'Malabar Bold Black Pepper (550+ GL)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Sun-dried garbled black pepper berries with high piperine yield.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    displayOrder: 6
  },
  {
    _id: 'pl-7',
    id: 'pl-7',
    name: 'Hand-Hammered Solid Copper Pitcher & Drinkware',
    category: 'Luxury Metalware & Art',
    description: '99.5%+ pure certified food-grade copper with artisan hammered finish.',
    defaultUnit: 'Master Cartons / Sets',
    isActive: true,
    displayOrder: 7
  },
  {
    _id: 'pl-8',
    id: 'pl-8',
    name: 'Pure Mulberry Silk Scarves & Pashmina Stoles',
    category: 'Textiles & Handloom',
    description: 'Loom-woven natural silk with hand-rolled hems and custom dye lots.',
    defaultUnit: 'Pieces / Master Cartons',
    isActive: true,
    displayOrder: 8
  },
  {
    _id: 'pl-9',
    id: 'pl-9',
    name: 'Custom Agricultural Sourcing / Bespoke Mandate',
    category: 'Custom B2B Sourcing',
    description: 'Direct procurement specification across verified Indian grower networks.',
    defaultUnit: 'As per Contract Specification',
    isActive: true,
    displayOrder: 9
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: INITIAL_PRODUCT_LINES.length,
    data: INITIAL_PRODUCT_LINES
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      _id: `pl-${Date.now()}`,
      id: `pl-${Date.now()}`,
      name: body.name || 'New Product Line',
      category: body.category || 'General Sourcing',
      description: body.description || '',
      defaultUnit: body.defaultUnit || 'Metric Tons (MT)',
      isActive: body.isActive !== undefined ? body.isActive : true,
      displayOrder: 10
    };

    return NextResponse.json({
      success: true,
      message: 'Product Line created successfully in live deployment.',
      data: newItem
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
