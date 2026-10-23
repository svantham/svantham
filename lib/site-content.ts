export const contact = {
  email: 'hello@svantham.in',
  phone: '+91 78452 99722',
  whatsapp: 'https://wa.me/917845299722?text=Hi%20Tailored!%20I%27d%20love%20to%20discuss%20a%20project.',
}

export interface Project {
  id: string;
  title: string;
  category: 'Software' | 'Content' | 'Digital marketing' | string;
  discipline: string;
  color: 'sage' | 'blue' | 'clay' | 'plum';
  images: string[];
  image: string;
  shortDescription: string;
  description: string;
  scope: string[];
}

export const projects: Project[] = [
  {
    id: 'custom-platform',
    title: 'Operations, simplified.',
    category: 'Software',
    discipline: 'Custom platform · UI/UX · Development',
    color: 'sage',
    images: ['/placeholder.svg?height=880&width=1250'],
    image: '/placeholder.svg?height=880&width=1250',
    shortDescription: 'Unified internal operations platform replacing fragmented spreadsheets with real-time tracking.',
    description: 'A purpose-built operational platform designed around daily workflows. Unifies inventory control, customer accounts, and real-time operational reporting into a single web workspace.',
    scope: ['Product strategy', 'Interface design', 'Full-stack development'],
  },
  {
    id: 'brand-stories',
    title: 'A brand worth remembering.',
    category: 'Content',
    discipline: 'Brand storytelling · Content production',
    color: 'blue',
    images: ['/placeholder.svg?height=880&width=1250'],
    image: '/placeholder.svg?height=880&width=1250',
    shortDescription: 'Strategic brand voice guidelines, visual storytelling, and multi-channel creative assets.',
    description: 'Crafted a distinct brand voice and accompanying visual narrative across web, editorial publications, and social media, establishing memorable positioning and customer affinity.',
    scope: ['Content strategy', 'Brand voice', 'Creative production'],
  },
  {
    id: 'digital-experience',
    title: 'More than a website.',
    category: 'Software',
    discipline: 'Website · Experience design · Development',
    color: 'clay',
    images: ['/placeholder.svg?height=880&width=1250'],
    image: '/placeholder.svg?height=880&width=1250',
    shortDescription: 'High-performance digital products engineered for conversion, responsiveness, and speed.',
    description: 'End-to-end digital experience crafted with obsessive attention to detail, responsive typography, intuitive user flows, and sub-second page transition speeds.',
    scope: ['UX research', 'Web design', 'Responsive development'],
  },
  {
    id: 'digital-growth',
    title: 'Made to find your people.',
    category: 'Digital marketing',
    discipline: 'Campaign strategy · Social · Digital marketing',
    color: 'plum',
    images: ['/placeholder.svg?height=880&width=1250'],
    image: '/placeholder.svg?height=880&width=1250',
    shortDescription: 'Targeted acquisition strategy delivering qualified leads and sustainable efficiency.',
    description: 'Designed and deployed targeted audience acquisition campaigns across search and social channels, combining creative storytelling with continuous conversion optimization.',
    scope: ['Audience strategy', 'Campaign creative', 'Performance marketing'],
  },
]

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
