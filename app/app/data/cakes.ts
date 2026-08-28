import type { Cake } from '~/types/cake'

export const featuredCakes: Cake[] = [
  {
    name: 'Frutos del sur',
    description: 'Bizcocho suave, crema liviana y una mezcla generosa de frambuesas y arándanos.',
    notes: 'Frutal · fresca · equilibrada',
    featured: true,
  },
  {
    name: 'Tres leches',
    description: 'Húmeda y delicada, con el dulzor justo para disfrutar hasta la última miga.',
    notes: 'Suave · húmeda · clásica',
  },
  {
    name: 'Chocolate y frambuesa',
    description: 'Chocolate intenso acompañado por la acidez natural de la frambuesa.',
    notes: 'Intensa · frutal · cremosa',
  },
  {
    name: 'Panqueque naranja',
    description: 'Capas finas, relleno aromático y ese sabor casero que invita a repetir.',
    notes: 'Cítrica · delicada · tradicional',
  },
]

export const classicFlavours = [
  'Selva negra',
  'Piña',
  'Durazno',
  'Mil hojas',
  'Moka',
  'Merengue frambuesa',
  'Pompadour',
  'Trufa',
]
