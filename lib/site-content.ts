export const contact = {
  email: 'hello@svantham.in',
  phone: '+91 78452 99722',
  whatsapp: 'https://wa.me/917845299722?text=Hi%20Tailored!%20I%27d%20love%20to%20discuss%20a%20project.',
}

export interface Project {
  id: string;
  title: string;
  category: 'Software' | 'Content' | 'Digital marketing' | string;
  images: string[];
  image: string;
  shortDescription: string;
  scope: string[];
}

export const testimonials = [
  {
    quote: '“Share a client’s words about how you turned their idea into software that fits the way they work.”',
    name: 'Client name',
    role: 'Role, company',
    category: 'Software development',
  },
  {
    quote: '“Add a client’s feedback on the stories, content, and creative work you brought to life together.”',
    name: 'Client name',
    role: 'Role, company',
    category: 'Content & storytelling',
  },
  {
    quote: '“Feature an approved testimonial about the strategy, collaboration, and impact of your digital marketing.”',
    name: 'Client name',
    role: 'Role, company',
    category: 'Digital marketing',
  },
]
