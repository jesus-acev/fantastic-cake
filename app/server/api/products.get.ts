import { defineEventHandler, getQuery } from 'h3'

export interface ApiProduct {
  id: number
  name: string
  slug: string
  shortDescription: string
  description: string
  price: number
  imageUrl: string
  category: string
  isFeatured: boolean
  rating: number
  prepTime: string
}

const mockProducts: ApiProduct[] = [
  {
    id: 1,
    name: 'Torta Selva Negra Royale',
    slug: 'torta-selva-negra-royale',
    shortDescription: 'Bizcochuelo de cacao de origen, cerezas maceradas en kirsch y crema batida artesanal.',
    description: 'Nuestra versión insigne de la clásica Selva Negra. Capas de bizcochuelo de chocolate húmedo, cerezas seleccionadas a mano y ganache suave de chocolate 70%.',
    price: 32.50,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    category: 'Tortas',
    isFeatured: true,
    rating: 4.9,
    prepTime: '24h bajo pedido'
  },
  {
    id: 2,
    name: 'Torta Tres Leches con Merengue Italiano',
    slug: 'torta-tres-leches-merengue',
    shortDescription: 'Bañada en mezcla secreta de tres leches perfumada con canela y vainilla Bourbon.',
    description: 'Bizcocho esponjoso impregnado con una mezcla cremosa de leche condensada, evaporada y crema de leche fresca, decorado con picos dorados de merengue.',
    price: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    category: 'Tortas',
    isFeatured: true,
    rating: 5.0,
    prepTime: 'Disponible hoy'
  },
  {
    id: 3,
    name: 'Cheesecake Frutos del Bosque',
    slug: 'cheesecake-frutos-del-bosque',
    shortDescription: 'Base crocante de galleta artesanal, queso crema suave y coulis casero de frutos rojos.',
    description: 'Textura sedosa horneada a fuego lento. Cubierto con un coulis balanceado entre acidez y dulzura hecho con moras, frambuesas y arándanos frescos.',
    price: 30.00,
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    category: 'Pasteles',
    isFeatured: true,
    rating: 4.8,
    prepTime: 'Disponible hoy'
  },
  {
    id: 4,
    name: 'Croissant Mantequilla Artesanal',
    slug: 'croissant-mantequilla-artesanal',
    shortDescription: 'Hojaldre francés tradicional elaborado durante 72 horas con mantequilla de vaca 100% pura.',
    description: 'Exterior dorado y crujiente, interior alvéolado suave y aromático. Horneado fresco cada mañana a las 7:00 AM.',
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    category: 'Panadería',
    isFeatured: true,
    rating: 4.9,
    prepTime: 'Horneado diario'
  },
  {
    id: 5,
    name: 'Brownie Fudge con Nuez Pecana',
    slug: 'brownie-fudge-nuez-pecana',
    shortDescription: 'Interior meloso con intenso sabor a chocolate bitter y trozos tostados de nuez pecana.',
    description: 'El equilibrio perfecto entre un centro suave tipo fudge y una fina capa crujiente superior. Elaborado con manteca de cacao pura.',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    category: 'Pasteles',
    isFeatured: false,
    rating: 4.7,
    prepTime: 'Disponible hoy'
  },
  {
    id: 6,
    name: 'Pie de Limón Merengado',
    slug: 'pie-de-limon-merengado',
    shortDescription: 'Masa sablé mantecosa, crema curada de limón criollo y merengue suizo flameado.',
    description: 'Un contraste vibrante entre la acidez refrescante del limón recién exprimido y el merengue dulce y esponjoso.',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    category: 'Pasteles',
    isFeatured: false,
    rating: 4.9,
    prepTime: 'Disponible hoy'
  },
  {
    id: 7,
    name: 'Pan de Masa Madre & Semillas',
    slug: 'pan-masa-madre-semillas',
    shortDescription: 'Fermentación natural de 48 horas con harina integral, girasol, sésamo y chía.',
    description: 'Corteza gruesa y crujiente con miga húmeda y llena de aire. Digestible y altamente nutritivo.',
    price: 6.00,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: 'Panadería',
    isFeatured: false,
    rating: 4.8,
    prepTime: 'Horneado diario'
  }
]

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const categoryFilter = query.category as string | undefined
  const featuredOnly = query.featured === 'true'

  let filtered = [...mockProducts]

  if (categoryFilter && categoryFilter !== 'Todos') {
    filtered = filtered.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase())
  }

  if (featuredOnly) {
    filtered = filtered.filter(p => p.isFeatured)
  }

  return {
    success: true,
    total: filtered.length,
    data: filtered,
    categories: ['Todos', 'Tortas', 'Pasteles', 'Panadería']
  }
})
