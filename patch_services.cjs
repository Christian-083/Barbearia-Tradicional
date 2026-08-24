const fs = require('fs');
let code = fs.readFileSync('src/data/services.ts', 'utf8');

const originalServices = `export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte Clássico',
    time: 30,
    price: 35,
    image: 'https://barbeariabigboss.com.br/wp-content/uploads/2025/07/a-historia-do-corte-degrade.png',
  },
  {
    id: 's2',
    name: 'Degradê / Fade',
    time: 40,
    price: 40,
    image: 'https://barbeariavintage.com.br/wp-content/uploads/2023/06/Acabamento-na-Vintage-Barbearia-em-Curitiba.jpg',
  },
  {
    id: 's3',
    name: 'Barboterapia',
    time: 30,
    price: 35,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYthS6_3gl2o3juat5raHWCRfaOEHaCG-jFQ&s',
  },
  {
    id: 's4',
    name: 'Corte + Barba',
    time: 60,
    price: 65,
    image: 'https://static.ndmais.com.br/2021/03/istock-1185955900-800x533.jpg',
  },
  {
    id: 's5',
    name: 'Nevou + Corte',
    time: 120,
    price: 120,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYthS6_3gl2o3juat5raHWCRfaOEHaCG-jFQ&s',
  },
  {
    id: 's6',
    name: 'Corte Infantil',
    time: 30,
    price: 30,
    image: 'https://barbeariabigboss.com.br/wp-content/uploads/2025/07/a-historia-do-corte-degrade.png',
  }
];`;

code = code.replace(/export const SERVICES: Service\[\] = \[[^]*?\];/m, originalServices);

fs.writeFileSync('src/data/services.ts', code);
