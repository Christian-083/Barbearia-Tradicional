const fs = require('fs');

// 1. Update CSS
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/--primary: #EAB308;/g, '--primary: #A23F22;');
css = css.replace(/--primary-foreground: #000000;/g, '--primary-foreground: #ffffff;');
css = css.replace(/--ring: #EAB308;/g, '--ring: #A23F22;');
css = css.replace(/--shadow-glow: 0 0 30px -5px rgba\(234, 179, 8, 0\.2\);/g, '--shadow-glow: 0 0 30px -5px rgba(162, 63, 34, 0.2);');
fs.writeFileSync('src/index.css', css);

// 2. Services Array
let servicesCode = fs.readFileSync('src/data/services.ts', 'utf8');
const newServices = `export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte infantil',
    time: 30,
    price: 20,
    image: 'https://barbeariabigboss.com.br/wp-content/uploads/2025/07/a-historia-do-corte-degrade.png',
  },
  {
    id: 's4',
    name: 'Corte de cabelo',
    time: 30,
    price: 20,
    image: 'https://barbeariavintage.com.br/wp-content/uploads/2023/06/Acabamento-na-Vintage-Barbearia-em-Curitiba.jpg',
  },
  {
    id: 's5',
    name: 'Nevou + corte',
    time: 60,
    price: 20,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYthS6_3gl2o3juat5raHWCRfaOEHaCG-jFQ&s',
  },
  {
    id: 's6',
    name: 'Barba',
    time: 20,
    price: 20,
    image: 'https://static.ndmais.com.br/2021/03/istock-1185955900-800x533.jpg',
  },
];`;
servicesCode = servicesCode.replace(/export const SERVICES: Service\[\] = \[[^]*?\];/m, newServices);

// Remove 7 and 12 from galleries if they exist
servicesCode = servicesCode.replace(/ *'\/images\/gallery-7\.jpg',\n/g, '');
servicesCode = servicesCode.replace(/ *'\/images\/gallery-12\.jpg',\n/g, '');

fs.writeFileSync('src/data/services.ts', servicesCode);

