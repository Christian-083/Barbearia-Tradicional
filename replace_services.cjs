const fs = require('fs');
let code = fs.readFileSync('src/data/services.ts', 'utf8');

const newServices = `export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Degradê',
    time: 30,
    price: 30,
    image: 'https://barbeariabigboss.com.br/wp-content/uploads/2025/07/a-historia-do-corte-degrade.png',
    category: 'corte',
  },
  {
    id: 's2',
    name: 'Corte Social',
    time: 30,
    price: 30,
    image: 'https://belezadohomem.com.br/wp-content/uploads/2025/07/corte-socialCortes-de-Cabelo-Comb-Over-Social-Masculino-2-1.jpg',
    category: 'corte',
  },
  {
    id: 's3',
    name: 'Barba',
    time: 20,
    price: 20,
    image: 'https://static.ndmais.com.br/2021/03/istock-1185955900-800x533.jpg',
    category: 'barba',
  },
  {
    id: 's4',
    name: 'Sobrancelha',
    time: 10,
    price: 10,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYthS6_3gl2o3juat5raHWCRfaOEHaCG-jFQ&s',
    category: 'estetica',
  },
  {
    id: 's5',
    name: 'Pezinho',
    time: 10,
    price: 10,
    image: 'https://barbeariavintage.com.br/wp-content/uploads/2023/06/Acabamento-na-Vintage-Barbearia-em-Curitiba.jpg',
    category: 'corte',
  },
  {
    id: 's6',
    name: 'Corte + Barba',
    time: 50,
    price: 45,
    image: 'https://i.imgur.com/CNtQpKn.png',
    category: 'combo',
  },
  {
    id: 's7',
    name: 'Limpeza de Pele',
    time: 30,
    price: 25,
    image: 'https://i.imgur.com/wBJ6xvZ.png',
    category: 'estetica',
  }
];`;

code = code.replace(/export const SERVICES: Service\[\] = \[[\s\S]*?\];/m, newServices);
fs.writeFileSync('src/data/services.ts', code);
