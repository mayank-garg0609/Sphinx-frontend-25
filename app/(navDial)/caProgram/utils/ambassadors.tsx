import type { Applicant } from '../types/caProgram'

export const ambassadors: readonly Applicant[] = [
  {
    id: 'anurag-sharma',
    name: "Anurag Sharma",
    college: "IIT Delhi",
    experience: "Promoted 50+ events across campus, managed social media campaigns, and successfully coordinated with college administration for fest participation.",
    image: "/image/human.webp",
  },
  {
    id: 'aditya-jain',
    name: "Aditya Jain", 
    college: "Graphic Era University",
    experience: "Led promotional activities for technical events, built strong network with student clubs, and achieved 200+ registrations from campus.",
    image: "/image/human.webp",
  },
  {
    id: 'neha',
    name: "Neha",
    college: "BITS Pilani", 
    experience: "Organized workshops and seminars, coordinated with multiple departments, and created engaging content for fest promotion.",
    image: "/image/human.webp",
  },
  {
    id: 'kartik-garg',
    name: "Kartik Garg",
    college: "VIT Vellore",
    experience: "Managed cross-college partnerships, developed promotional strategies, and facilitated participation from 15+ student societies.",
    image: "/image/human.webp",
  },
] as const