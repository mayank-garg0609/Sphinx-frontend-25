import type { FAQ } from '../types/caProgram'

export const faqs: readonly FAQ[] = [
  {
    id: 'who-can-apply',
    question: "Who can apply for the Campus Ambassador program?",
    answer: "Any undergraduate or postgraduate student currently enrolled in a recognized college or university in India can apply. We welcome students from all branches and years of study.",
  },
  {
    id: 'program-duration',
    question: "What is the duration of the program?", 
    answer: "The program runs for approximately 2-3 months, starting from the application period and continuing through the fest. Active promotion typically intensifies in the final month before Sphinx.",
  },
  {
    id: 'paid-opportunity',
    question: "Is this a paid opportunity?",
    answer: "While this is an unpaid volunteer role, it offers valuable incentives including certificates, exclusive merchandise, internship opportunities with our sponsors, and networking benefits that can enhance your career prospects.",
  },
  {
    id: 'selection-process',
    question: "How will I be selected as a Campus Ambassador?",
    answer: "Selection is based on your application form, your enthusiasm for event promotion, communication skills, and your ability to engage with your college community. We also consider your past experience in organizing or promoting events.",
  },
  {
    id: 'team-support',
    question: "What kind of support will I receive from Team Sphinx?",
    answer: "You'll receive comprehensive promotional materials, regular guidance from our team, access to exclusive webinars, and direct communication channels with the organizing committee for any assistance you need.",
  },
] as const