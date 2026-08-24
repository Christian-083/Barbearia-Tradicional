// Centralized Image Imports & Asset Pipeline from src/Image
// Importing directly ensures Vite compiles and bundles all images into production without 404 errors.

import topoImg from '../Image/Barbearia_Tradicional TOPO.jpg';
import aboutImg from '../Image/Foto_DA_PESSOA_BARBEARIA_TRADICIONAL.jpg';
import fachadaImg from '../Image/Fachada_Barbearia.jpg';
import instagramImg from '../Image/Barbearia-Instragram.jpeg';

// Gallery images
import g1 from '../Image/Barbearia_Tradicional (1).jpg';
import g3 from '../Image/Barbearia_Tradicional (3).jpg';
import g4 from '../Image/Barbearia_Tradicional (4).jpg';
import g5 from '../Image/Barbearia_Tradicional (5).jpg';
import g6 from '../Image/Barbearia_Tradicional (6).jpg';
import g8 from '../Image/Barbearia_Tradicional (8).jpg';
import g10 from '../Image/Barbearia_Tradicional (10).jpg';
import g11 from '../Image/Barbearia_Tradicional (11).jpg';
import g12 from '../Image/Barbearia_Tradicional (12).jpg';
import g13 from '../Image/Barbearia_Tradicional (13).jpg';
import g14 from '../Image/Barbearia_Tradicional (14).jpg';

export const IMAGES = {
  hero: topoImg,
  about: aboutImg,
  fachada: fachadaImg,
  instagram: instagramImg,
  services: {
    degrade: g1,
    corteSocial: g3,
    barba: g4,
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
  ],
};

export default IMAGES;
