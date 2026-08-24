const fs = require('fs');
let code = fs.readFileSync('src/components/ReviewsSection.tsx', 'utf8');
code = code.replace(
`const REVIEWS_IMAGES = [
  "https://barbearia-e.netlify.app/assets/depoimento-1-BmKDqp4_.png",
  "https://barbearia-e.netlify.app/assets/depoimento-2-KnB4UowP.png",
  "https://barbearia-e.netlify.app/assets/depoimento-3-CQpzjvcR.png",
  "https://barbearia-e.netlify.app/assets/depoimento-4-FSJQf-XH.png",
  "https://barbearia-e.netlify.app/assets/depoimento-5-DVlb23Bf.png",
  "https://barbearia-e.netlify.app/assets/depoimento-6-CeudhoFU.png",
];`,
`const REVIEWS_IMAGES = [
  "https://barbearia-e.netlify.app/assets/depoimento-2-KnB4UowP.png",
  "https://barbearia-e.netlify.app/assets/depoimento-3-CQpzjvcR.png",
  "https://barbearia-e.netlify.app/assets/depoimento-4-FSJQf-XH.png",
  "https://barbearia-e.netlify.app/assets/depoimento-5-DVlb23Bf.png",
  "https://barbearia-e.netlify.app/assets/depoimento-6-CeudhoFU.png",
];`);
fs.writeFileSync('src/components/ReviewsSection.tsx', code);
