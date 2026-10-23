export const product = {
  name: 'product',
  category: 'CRM',
  annualSubscription: 12_000,
  annualLicense: 12_000,
  comparisonAnnualPerUser: 10_000,
  comparisonBaseUsers: 10,
} as const

export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const productFAQs = [
  {
    question: 'Is it really ₹1,000 / month for the whole team?',
    answer:
      'Yes. ₹1,000 per month (billed annually at ₹12,000 / year) is the flat subscription price, not a per-user fee. Continuous updates and 1-on-1 support are included. Add teammates without buying extra seats.',
  },
  {
    question: 'What does “no artificial limits” actually mean?',
    answer:
      'There are no software-imposed caps on seats, leads, or contacts. Your subscription includes your whole team, without paying more when you grow.',
  },
  {
    question: 'How is Svantham deployed?',
    answer:
      'Svantham is fully managed SaaS in the cloud. We handle all hosting, security, backups, and maintenance, so you can focus entirely on running your business.',
  },
  {
    question: 'What support and updates are included?',
    answer:
      'Every subscription includes regular software updates, security patches, and 1-on-1 customer support. There are no surprise support tiers or maintenance add-ons.',
  },
  {
    question: 'How does the pricing comparison work?',
    answer:
      'The calculator contrasts our flat annual subscription against typical per-user SaaS software (illustrative ₹10,000 per user per year). With Svantham, whether you have 5 or 50 team members, your subscription remains predictable.',
  },
  {
    question: 'Is this a monthly or annual subscription?',
    answer:
      'It is an annual subscription priced at ₹1,000 per month (₹12,000 / year, or ₹3,000 / year for POSS). Your subscription covers your entire team with full updates and support.',
  },
] as const
