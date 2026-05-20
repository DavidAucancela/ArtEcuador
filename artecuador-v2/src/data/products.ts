export type Badge = 'feat' | 'new' | 'limit';

export interface Product {
  slug: string;
  img: string;
  alt: string;
  badge?: Badge;
  category: string;
  name: string;
  desc: string;
  price: string;
}

export interface Section {
  id: string;
  label: string;
  title: string;
  titleEm: string;
  alt: boolean;
  products: Product[];
}

export const sections: Section[] = [
  {
    id: 'cuadros',
    label: '01 — Colección',
    title: 'Cuadros',
    titleEm: 'y Pinturas',
    alt: false,
    products: [
      { slug: 'cuadros-guayasamin-en-barro',    img: 'cuadros-guayasamin-barro.png',      alt: 'Cuadros Guayasamín en Barro',         badge: 'feat',  category: 'Cuadros · Guayasamín', name: 'Cuadros Guayasamín en Barro',       desc: 'Reproducciones artesanales de obras de Oswaldo Guayasamín en bajo relieve sobre barro, pintadas a mano.',                              price: '45.00' },
      { slug: 'guayasamin-serie-2',             img: 'cuadros-guayasamin-2.png',           alt: 'Cuadros Guayasamín Serie 2',                           category: 'Cuadros · Guayasamín', name: 'Guayasamín — Serie 2',               desc: 'Segunda colección de cuadros inspirados en Guayasamín, con técnica mixta y colores característicos del maestro.',                      price: '38.00' },
      { slug: 'la-ronda-quito-acrilico',        img: 'cuadro-acrilico-la-ronda.png',       alt: 'La Ronda de Quito — Acrílico',        badge: 'new',   category: 'Cuadros · Quito',      name: 'La Ronda de Quito — Acrílico',      desc: 'Cuadro acrílico de La Ronda, icónica calle del Centro Histórico de Quito, pintado por artistas locales.',                              price: '55.00' },
      { slug: 'la-ronda-vista-2',               img: 'cuadro-la-ronda-2.png',              alt: 'La Ronda de Quito — Vista 2',                          category: 'Cuadros · Quito',      name: 'La Ronda — Vista 2',                desc: 'Segunda perspectiva de La Ronda quiteña en técnica mixta, capturando la vida nocturna del barrio histórico.',                           price: '50.00' },
      { slug: 'iglesia-san-francisco-quito',    img: 'cuadro-san-francisco-quito.png',     alt: 'Iglesia San Francisco de Quito',      badge: 'feat',  category: 'Cuadros · Quito',      name: 'Iglesia San Francisco de Quito',    desc: 'Cuadro de la emblemática Iglesia de San Francisco, pintado con detalle arquitectónico colonial y luz andina.',                          price: '60.00' },
      { slug: 'cotopaxi-animado',               img: 'cuadro-cotopaxi-animado.png',        alt: 'Cotopaxi Animado',                    badge: 'new',   category: 'Cuadros · Volcanes',   name: 'Cotopaxi Animado',                  desc: 'Pintura del volcán Cotopaxi con estilo naïf, representando la relación del pueblo con el paisaje andino ecuatoriano.',                  price: '42.00' },
      { slug: 'cuadro-tronco-natural',          img: 'cuadro-con-base-tronco.png',         alt: 'Cuadro sobre Tronco Natural',                          category: 'Cuadros · Madera',     name: 'Cuadro sobre Tronco Natural',       desc: 'Escenas andinas pintadas sobre madera con base de tronco natural. Cada pieza es única por la forma del tronco.',                        price: '35.00' },
      { slug: 'bateas-tigua',                   img: 'bateas-madera-tigua.png',            alt: 'Bateas Pintadas de Tigua',             badge: 'feat',  category: 'Cuadros · Tigua',      name: 'Bateas Pintadas de Tigua',          desc: 'Bateas decorativas pintadas a mano con escenas de vida andina y flora nativa. Arte naïf de Tigua, Cotopaxi.',                           price: '28.00' },
    ],
  },
  {
    id: 'ceramica',
    label: '02 — Colección',
    title: 'Cerámica',
    titleEm: 'Ancestral',
    alt: true,
    products: [
      { slug: 'ceramica-otavalena',             img: 'ceramica-otavalena-tradicional.png', alt: 'Cerámica Otavaleña Tradicional',       badge: 'feat',  category: 'Cerámica · Otavalo',   name: 'Cerámica Otavaleña Tradicional',    desc: 'Piezas pintadas a mano con motivos andinos por artesanos de Otavalo usando pigmentos naturales.',                                        price: '22.00' },
      { slug: 'vasijas-cuencanas',              img: 'ceramica-cuencana-vasijas.png',      alt: 'Vasijas Cuencanas',                    badge: 'new',   category: 'Cerámica · Cuenca',    name: 'Vasijas Cuencanas',                 desc: 'Vasijas elaboradas con técnicas coloniales de Cuenca, esmaltadas y pintadas a mano con diseños floreados.',                             price: '18.00' },
      { slug: 'ceramica-imbabura',              img: 'ceramica-imbabura.png',              alt: 'Cerámica de Imbabura',                                  category: 'Cerámica · Imbabura',  name: 'Cerámica de Imbabura',              desc: 'Cerámica característica de la provincia de Imbabura con pigmentos naturales y formas tradicionales.',                                   price: '15.00' },
      { slug: 'figura-saraguro',                img: 'ceramica-hombre-saraguro.png',       alt: 'Figura Saraguro en Cerámica',          badge: 'limit', category: 'Cerámica · Figuras',   name: 'Figura Saraguro en Cerámica',       desc: 'Figura del hombre Saraguro en cerámica pintada a mano con el atuendo negro tradicional de la cultura.',                                 price: '25.00' },
      { slug: 'figura-riobambena',              img: 'ceramica-hombre-riobambeno.png',     alt: 'Figura Riobambeña',                                    category: 'Cerámica · Figuras',   name: 'Figura Riobambeña',                 desc: 'Figura de hombre riobambeño en cerámica pintada con atuendo festivo típico de la Sierra central.',                                      price: '20.00' },
      { slug: 'pocillos-barro',                 img: 'pocillos-pequenos-barro.png',        alt: 'Pocillos de Barro',                    badge: 'new',   category: 'Cerámica · Utilitaria',name: 'Pocillos de Barro',                 desc: 'Pocillos artesanales de barro cocido a leña con acabado natural. Perfectos para café o infusiones.',                                    price: '12.00' },
      { slug: 'vasijas-barro-grande',           img: 'vasos-barro-grande.png',             alt: 'Vasijas de Barro Grande',                               category: 'Cerámica · Vasijas',   name: 'Vasijas de Barro Grande',           desc: 'Vasijas de gran formato en barro natural, ideales para decoración o almacenamiento artesanal.',                                          price: '30.00' },
      { slug: 'guayasamin-barro-ceramica',      img: 'cuadros-guayasamin-barro.png',       alt: 'Cuadros Guayasamín en Barro',          badge: 'feat',  category: 'Cerámica · Arte',      name: 'Cuadros Guayasamín en Barro',       desc: 'Reproducciones artesanales en barro de obras inspiradas en Oswaldo Guayasamín, maestro de la pintura ecuatoriana.',                     price: '40.00' },
      { slug: 'ceramica-ponchos-otavalo',       img: 'ceramica-ponchos-otavalo.png',       alt: 'Cerámica Ponchos Otavalo',             badge: 'new',   category: 'Cerámica · Otavalo',   name: 'Cerámica Ponchos Otavalo',          desc: 'Gran pieza de cerámica otavaleña con representación de ponchos y tejidos andinos en alto relieve pintado a mano.',                      price: '35.00' },
      { slug: 'ceramica-saraguro',              img: 'ceramica-saragura.png',              alt: 'Cerámica Saraguro',                                    category: 'Cerámica · Figuras',   name: 'Cerámica Saraguro',                 desc: 'Figura cerámica de la cultura Saraguro, elaborada con arcilla negra y decorada con simbologías ancestrales.',                           price: '28.00' },
    ],
  },
  {
    id: 'cuero',
    label: '03 — Colección',
    title: 'Cuero',
    titleEm: 'Artesanal',
    alt: false,
    products: [
      { slug: 'carteras-billeteras-tigua',      img: 'carteras-billeteras-tigua-cuero.png',alt: 'Carteras y Billeteras Tigua en Cuero', badge: 'feat',  category: 'Cuero · Carteras',     name: 'Carteras y Billeteras Tigua',       desc: 'Carteras y billeteras de cuero genuino con diseños pintados a mano del arte Tigua. Funcionales y únicas.',                             price: '45.00' },
      { slug: 'portallaves-cuero',              img: 'portallaves-cuero-2.png',            alt: 'Porta Llaves de Cuero',                badge: 'new',   category: 'Cuero · Accesorios',   name: 'Porta Llaves de Cuero',             desc: 'Porta llaves artesanal en cuero genuino con grabado de motivos andinos, cosido a mano.',                                                price: '12.00' },
      { slug: 'portallaves-cuero-clasico',      img: 'portallaves-cuero.png',              alt: 'Porta Llaves Cuero Clásico',                           category: 'Cuero · Accesorios',   name: 'Porta Llaves Cuero Clásico',        desc: 'Porta llaves en cuero natural con corte artesanal y acabado al aceite, diseño minimalista andino.',                                     price: '10.00' },
    ],
  },
  {
    id: 'otros',
    label: '04 — Colección',
    title: 'Otras',
    titleEm: 'Artesanías',
    alt: true,
    products: [
      { slug: 'mascaras-madera',                img: 'mascaras-ecuatorianas-madera.png',   alt: 'Máscaras Ecuatorianas en Madera',      badge: 'feat',  category: 'Otros · Máscaras',     name: 'Máscaras Ecuatorianas en Madera',   desc: 'Colección de máscaras ceremoniales talladas en madera de cedro y pintadas a mano con colores vivos.',                                   price: '32.00' },
      { slug: 'animales-galapagos',             img: 'animales-galapagos-madera.png',      alt: 'Animales de Galápagos en Madera',      badge: 'new',   category: 'Otros · Madera',       name: 'Animales de Galápagos en Madera',   desc: 'Figuras talladas en madera de animales endémicos de Galápagos: tortugas, iguanas y piqueros de patas azules.',                          price: '18.00' },
      { slug: 'sol-luna-cedro',                 img: 'sol-luna-madera-cedro.png',          alt: 'Sol y Luna en Cedro',                                  category: 'Otros · Madera',       name: 'Sol y Luna en Cedro',               desc: 'Dúo decorativo tallado en madera de cedro con acabado natural, símbolo de la cosmovisión andina.',                                      price: '22.00' },
      { slug: 'carros-madera',                  img: 'carros-tradicionales-madera.png',    alt: 'Carros Tradicionales en Madera',       badge: 'new',   category: 'Otros · Madera',       name: 'Carros Tradicionales en Madera',    desc: 'Réplicas artesanales de vehículos clásicos ecuatorianos tallados y pintados a mano en madera de cedro.',                                price: '25.00' },
      { slug: 'fachadas-coloniales',            img: 'casas-fachada-tradicionales.png',    alt: 'Fachadas Coloniales en Madera',                        category: 'Otros · Madera',       name: 'Fachadas Coloniales en Madera',     desc: 'Miniaturas de casas coloniales quiteñas talladas en madera, con detalles pintados a mano.',                                             price: '28.00' },
      { slug: 'avion-madera',                   img: 'avion-madera.png',                   alt: 'Avión Artesanal en Madera',                            category: 'Otros · Madera',       name: 'Avión Artesanal en Madera',         desc: 'Avión decorativo tallado y pintado a mano en madera, pieza coleccionable elaborada por artesanos quiteños.',                            price: '20.00' },
      { slug: 'nacimiento-andino',              img: 'nacimiento-mini.png',                alt: 'Nacimiento Andino Miniatura',                          category: 'Otros · Nacimientos',  name: 'Nacimiento Andino Miniatura',       desc: 'Nacimiento en miniatura pintado a mano con técnica Tigua. Figuras de la natividad vestidas con trajes andinos.',                        price: '15.00' },
      { slug: 'mitad-del-mundo',                img: 'mitad-del-mundo-marmol.png',         alt: 'Mitad del Mundo en Mármol',            badge: 'limit', category: 'Otros · Mármol',       name: 'Mitad del Mundo en Mármol',         desc: 'Réplica del monumento Mitad del Mundo tallada en mármol oscuro con acabado pulido a mano, edición limitada.',                           price: '65.00' },
      { slug: 'avion-madera-serie-2',           img: 'avion-madera-2.png',                 alt: 'Avión Artesanal — Serie 2',            badge: 'new',   category: 'Otros · Madera',       name: 'Avión Artesanal — Serie 2',         desc: 'Segunda versión del avión decorativo en madera pintado a mano, con colores de la bandera ecuatoriana.',                                 price: '22.00' },
      { slug: 'cruces-tigua',                   img: 'cruces-tigua-madera.png',            alt: 'Cruces Tigua en Madera',                               category: 'Otros · Madera',       name: 'Cruces Tigua en Madera',            desc: 'Pequeñas cruces talladas y pintadas con arte Tigua. Motivos andinos y escenas de la vida comunitaria.',                                 price: '8.00'  },
      { slug: 'nacimiento-andino-serie-2',      img: 'nacimiento-mini-2.png',              alt: 'Nacimiento Andino — Serie 2',                          category: 'Otros · Nacimientos',  name: 'Nacimiento Andino — Serie 2',       desc: 'Variante del nacimiento en miniatura con técnica Tigua y paleta de colores tierra de la Sierra ecuatoriana.',                           price: '15.00' },
      { slug: 'nacimiento-caja-fosforo',        img: 'nacimiento-caja-fosforo.png',        alt: 'Nacimiento Caja de Fósforo',           badge: 'new',   category: 'Otros · Nacimientos',  name: 'Nacimiento Caja de Fósforo',        desc: 'Nacimiento en miniatura extrema dentro de caja de fósforos, delicado trabajo artesanal de figuras pintadas a mano.',                    price: '10.00' },
      { slug: 'nacimiento-chimborazo',          img: 'nacimiento-chimborazo.png',          alt: 'Nacimiento Chimborazo',                                category: 'Otros · Nacimientos',  name: 'Nacimiento Chimborazo',             desc: 'Nacimiento andino con el volcán Chimborazo de fondo, técnica Tigua con figuras vestidas con trajes de la Sierra.',                      price: '18.00' },
    ],
  },
];

export const clientImages = [
  'clientes-1.jpg', 'clientes-2.jpg', 'clientes-3.jpg',
  'dueno.png', 'dueno-2.png', 'clientes-4.png',
  'recomendacion.png', 'trabajpos.png',
];

/** Todos los productos con su sección, para getStaticPaths */
export function allProducts() {
  return sections.flatMap((s) =>
    s.products.map((p) => ({ ...p, sectionId: s.id, sectionTitle: `${s.title} ${s.titleEm}` }))
  );
}
