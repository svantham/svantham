export const contact = {
  email: 'hello@svantham.in',
  phone: '+91 78452 99722',
  whatsapp: 'https://wa.me/917845299722?text=Hi%20Tailored!%20I%27d%20love%20to%20discuss%20a%20project.',
}

export const projects = [
  {
    id: 'custom-platform',
    title: 'Operations, simplified.',
    category: 'Software',
    discipline: 'Custom platform · UI/UX · Development',
    color: 'sage',
    image: '/placeholder.svg?height=880&width=1250',
    description: 'A space to showcase a custom platform built around a client’s day-to-day operations. Replace this sample with the client name, the challenge, and what your team delivered.',
    scope: ['Product strategy', 'Interface design', 'Full-stack development'],
  },
  {
    id: 'brand-stories',
    title: 'A brand worth remembering.',
    category: 'Content',
    discipline: 'Brand storytelling · Content production',
    color: 'blue',
    image: '/placeholder.svg?height=880&width=1250',
    description: 'A space for a client’s content and brand storytelling project. Add the real brief, the creative direction, and a selection of the content you produced.',
    scope: ['Content strategy', 'Brand voice', 'Creative production'],
  },
  {
    id: 'digital-experience',
    title: 'More than a website.',
    category: 'Software',
    discipline: 'Website · Experience design · Development',
    color: 'clay',
    image: '/placeholder.svg?height=880&width=1250',
    description: 'A space for a website or digital product your team brought to life. Replace this sample with project imagery, the client’s requirements, and the finished experience.',
    scope: ['UX research', 'Web design', 'Responsive development'],
  },
  {
    id: 'digital-growth',
    title: 'Made to find your people.',
    category: 'Digital marketing',
    discipline: 'Campaign strategy · Social · Digital marketing',
    color: 'plum',
    image: '/placeholder.svg?height=880&width=1250',
    description: 'A space for a digital marketing campaign. Add the audience, channel strategy, campaign creative, and verified results from an actual client engagement.',
    scope: ['Audience strategy', 'Campaign creative', 'Performance marketing'],
  },
] as const

export type Project = (typeof projects)[number]

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
