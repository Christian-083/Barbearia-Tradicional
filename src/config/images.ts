// Centralized Image Imports & Asset Pipeline
// Importing directly ensures Vite compiles and bundles all images into production (Vercel, Netlify, etc.) without 404 errors.

import topoImg from '../Barbearia_Tradicional/Barbearia_Tradicional TOPO.jpg';
import aboutImg from '../Barbearia_Tradicional/Foto_DA_PESSOA_BARBEARIA_TRADICIONAL.jpg';
import fachadaImg from '../Barbearia_Tradicional/Fachada_Barbearia.jpg';
import instagramImg from '../Barbearia_Tradicional/Barbearia-Instragram.jpeg';
import corteSocialImg from '../Barbearia_Tradicional/corte-de-cabelo-social-2.webp';
import serviceDegradeImg from '../Barbearia_Tradicional/service-degrade.png';
import serviceBarbaImg from '../Barbearia_Tradicional/service-barba.jpg';
import academyImg from '../Barbearia_Tradicional/academy.png';

// Gallery images
import g1 from '../Barbearia_Tradicional/Barbearia_Tradicional (1).jpg';
import g3 from '../Barbearia_Tradicional/Barbearia_Tradicional (3).jpg';
import g4 from '../Barbearia_Tradicional/Barbearia_Tradicional (4).jpg';
import g5 from '../Barbearia_Tradicional/Barbearia_Tradicional (5).jpg';
import g6 from '../Barbearia_Tradicional/Barbearia_Tradicional (6).jpg';
import g8 from '../Barbearia_Tradicional/Barbearia_Tradicional (8).jpg';
import g10 from '../Barbearia_Tradicional/Barbearia_Tradicional (10).jpg';
import g11 from '../Barbearia_Tradicional/Barbearia_Tradicional (11).jpg';
import g12 from '../Barbearia_Tradicional/Barbearia_Tradicional (12).jpg';
import g13 from '../Barbearia_Tradicional/Barbearia_Tradicional (13).jpg';
import g14 from '../Barbearia_Tradicional/Barbearia_Tradicional (14).jpg';

// Testimonials
import dep1 from '../Barbearia_Tradicional/depoimento-1.png';
import dep2 from '../Barbearia_Tradicional/depoimento-2.png';
import dep3 from '../Barbearia_Tradicional/depoimento-3.png';
import dep4 from '../Barbearia_Tradicional/depoimento-4.png';
import dep5 from '../Barbearia_Tradicional/depoimento-5.png';
import dep6 from '../Barbearia_Tradicional/depoimento-6.png';

export const IMAGES = {
  hero: topoImg,
  about: aboutImg,
  fachada: fachadaImg,
  instagram: instagramImg,
  academy: academyImg,
  services: {
    degrade: serviceDegradeImg,
    corteSocial: corteSocialImg,
    barba: serviceBarbaImg,
  },
  gallery: [
    g1,
    g3,
    g4,
    g5,
    g6,
    g8,
    g10,
    g11,
    g12,
    g13,
    g14,
    instagramImg,
  ],
  testimonials: [
    dep1,
    dep2,
    dep3,
    dep4,
    dep5,
    dep6,
  ],
};

export default IMAGES;
