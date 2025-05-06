// Create or update this file to provide better sample events

const getSampleEvents = () => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      id: 'sample-1',
      title: 'Cryptography Fundamentals Workshop',
      description: 'An introductory workshop covering the basics of modern cryptography, including symmetric and asymmetric encryption, hash functions, and digital signatures.',
      start_date: `${currentYear}-04-15T09:00:00Z`,
      end_date: `${currentYear}-04-15T17:00:00Z`,
      venue: {
        name: 'IIIT Delhi',
        address: 'IIIT Delhi, New Delhi',
        city: 'New Delhi',
        country: 'India'
      },
      organizer: 'IIIT Delhi Cryptography Department',
      url: 'https://www.iiitd.ac.in/events',
      image_url: '/images/crypto-workshop.jpg',
      source: 'sample',
      category: 'workshop',
      tags: ['cryptography', 'education', 'workshop']
    },
    {
      id: 'sample-2',
      title: 'Blockchain Security Conference',
      description: 'A three-day virtual conference focused on blockchain security, smart contract vulnerabilities, and decentralized finance security challenges.',
      start_date: `${currentYear}-05-20T10:00:00Z`,
      end_date: `${currentYear}-05-22T18:00:00Z`,
      venue: {
        name: 'Virtual Event',
        address: 'Online',
        city: '',
        country: ''
      },
      organizer: 'Blockchain Security Alliance',
      url: 'https://www.blockchainsecurityalliance.org',
      image_url: '/images/blockchain-conference.jpg',
      source: 'sample',
      category: 'conference',
      tags: ['blockchain', 'security', 'conference']
    },
    {
      id: 'sample-3',
      title: 'Quantum Cryptography Symposium',
      description: 'An exploration of quantum cryptography advancements and their implications for future security protocols. Leading researchers will present the latest findings.',
      start_date: `${currentYear}-06-10T09:00:00Z`,
      end_date: `${currentYear}-06-10T18:00:00Z`,
      venue: {
        name: 'India Habitat Centre',
        address: 'India Habitat Centre, New Delhi',
        city: 'New Delhi',
        country: 'India'
      },
      organizer: 'Indian Cryptographic Research Group',
      url: 'https://www.quantumcrypto-symposium.org',
      image_url: '/images/quantum-crypto.jpg',
      source: 'sample',
      category: 'symposium',
      tags: ['quantum', 'cryptography', 'research']
    },
    {
      id: 'sample-4',
      title: 'Ethical Hacking Bootcamp',
      description: 'Intensive 5-day bootcamp on ethical hacking techniques, penetration testing, and security assessment methodologies.',
      start_date: `${currentYear}-04-05T09:00:00Z`,
      end_date: `${currentYear}-04-09T17:00:00Z`,
      venue: {
        name: 'Cyber Security Training Center',
        address: 'Cyber Security Training Center, Bangalore',
        city: 'Bangalore',
        country: 'India'
      },
      organizer: 'CyberSec India',
      url: 'https://www.cybersec-india.org/bootcamp',
      image_url: '/images/ethical-hacking.jpg',
      source: 'sample',
      category: 'bootcamp',
      tags: ['hacking', 'security', 'training']
    },
    {
      id: 'sample-5',
      title: 'Zero-Knowledge Proofs Workshop',
      description: 'Technical workshop on implementing zero-knowledge proof systems for privacy-preserving applications and identity verification.',
      start_date: `${currentYear}-07-12T10:00:00Z`,
      end_date: `${currentYear}-07-12T16:00:00Z`,
      venue: {
        name: 'IIT Mumbai',
        address: 'IIT Mumbai, Mumbai',
        city: 'Mumbai',
        country: 'India'
      },
      organizer: 'Privacy Tech Foundation',
      url: 'https://www.privacytech.org/zkp-workshop',
      image_url: '/images/zkp-workshop.jpg',
      source: 'sample',
      category: 'workshop',
      tags: ['zero-knowledge', 'privacy', 'cryptography']
    },
    {
      id: 'sample-6',
      title: 'Cybersecurity Summit 2025',
      description: 'India\'s largest cybersecurity conference featuring keynotes, technical sessions, and hands-on workshops covering the latest threats and defenses.',
      start_date: `${currentYear}-09-25T09:00:00Z`,
      end_date: `${currentYear}-09-27T18:00:00Z`,
      venue: {
        name: 'Hyderabad International Convention Centre',
        address: 'Hyderabad International Convention Centre',
        city: 'Hyderabad',
        country: 'India'
      },
      organizer: 'Indian Cybersecurity Alliance',
      url: 'https://www.indiacybersec.org/summit2025',
      image_url: '/images/cybersec-summit.jpg',
      source: 'sample',
      category: 'conference',
      tags: ['cybersecurity', 'conference', 'security']
    }
  ];
};

module.exports = { getSampleEvents };