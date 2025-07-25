import { Lesson } from '@/types';

export const SAMPLE_LESSONS: Record<string, Lesson[]> = {
  spanish: [
    {
      id: 'es-sandwich-order',
      title: 'Ordering a Sandwich',
      scenario: 'restaurant',
      language: 'spanish',
      difficulty: 1,
      culturalNotes: 'In many Spanish-speaking countries, lunch is the main meal. Sandwiches (bocadillos) are popular for a lighter meal.',
      phrases: [
        {
          id: 'es-1',
          phrase: 'Quisiera un sándwich, por favor',
          translation: "I'd like a sandwich, please",
          literal: 'I would like a sandwich, please'
        },
        {
          id: 'es-2',
          phrase: '¿Qué tipo de pan tienen?',
          translation: 'What type of bread do you have?',
          literal: 'What type of bread have you?'
        },
        {
          id: 'es-3',
          phrase: 'Sin tomate, por favor',
          translation: 'Without tomato, please',
          literal: 'Without tomato, please'
        },
        {
          id: 'es-4',
          phrase: '¿Cuánto cuesta?',
          translation: 'How much does it cost?',
          literal: 'How much costs?'
        }
      ],
      variations: {
        formal: ['Disculpe, ¿podría prepararme un sándwich sin cebolla?'],
        informal: ['Oye, ¿me haces un sándwich sin cebolla?'],
        regional: {
          mexico: {
            region: 'Mexico',
            phrases: ['torta', 'bolillo', 'telera'],
            notes: 'In Mexico, sandwiches are often called "tortas"'
          },
          spain: {
            region: 'Spain',
            phrases: ['bocadillo', 'bocata'],
            notes: 'In Spain, sandwiches are called "bocadillos"'
          },
          argentina: {
            region: 'Argentina',
            phrases: ['sándwich de miga', 'tostado'],
            notes: 'Argentina has unique sandwich styles'
          }
        }
      },
      tags: ['food', 'restaurant', 'basic']
    },
    // Add more Spanish lessons...
  ],
  italian: [
    {
      id: 'it-coffee-order',
      title: 'Ordering Coffee',
      scenario: 'cafe',
      language: 'italian',
      difficulty: 1,
      culturalNotes: 'In Italy, cappuccino is only drunk in the morning. After 11am, Italians typically order espresso.',
      phrases: [
        {
          id: 'it-1',
          phrase: 'Vorrei un caffè, per favore',
          translation: "I'd like a coffee, please",
          literal: 'I would like a coffee, please'
        },
        {
          id: 'it-2',
          phrase: 'Un cappuccino, grazie',
          translation: 'A cappuccino, thank you',
          literal: 'A cappuccino, thanks'
        },
        {
          id: 'it-3',
          phrase: 'Quanto costa?',
          translation: 'How much does it cost?',
          literal: 'How much costs?'
        },
        {
          id: 'it-4',
          phrase: 'Posso pagare con carta?',
          translation: 'Can I pay by card?',
          literal: 'Can I pay with card?'
        }
      ],
      variations: {
        formal: ['Potrebbe farmi un caffè macchiato?'],
        informal: ['Mi fai un caffè?'],
        regional: {
          milan: {
            region: 'Milan',
            phrases: ['caffè ristretto'],
            notes: 'In Milan, coffee is often served stronger'
          },
          naples: {
            region: 'Naples',
            phrases: ['caffè sospeso'],
            notes: 'Naples has a tradition of "suspended coffee" - paying for an extra coffee for someone in need'
          }
        }
      },
      tags: ['food', 'cafe', 'basic', 'culture']
    },
    // Add more Italian lessons...
  ],
  english: [
    {
      id: 'en-directions',
      title: 'Asking for Directions',
      scenario: 'street',
      language: 'english',
      difficulty: 2,
      culturalNotes: 'In English-speaking countries, people often give directions using landmarks rather than street names.',
      phrases: [
        {
          id: 'en-1',
          phrase: 'Excuse me, could you help me?',
          translation: 'Disculpe, ¿podría ayudarme?',
          literal: 'Excuse me, could you help me?'
        },
        {
          id: 'en-2',
          phrase: "I'm looking for the train station",
          translation: 'Estoy buscando la estación de tren',
          literal: 'I am looking for the train station'
        },
        {
          id: 'en-3',
          phrase: 'Is it far from here?',
          translation: '¿Está lejos de aquí?',
          literal: 'Is it far from here?'
        },
        {
          id: 'en-4',
          phrase: 'Thank you so much for your help',
          translation: 'Muchas gracias por su ayuda',
          literal: 'Thank you so much for your help'
        }
      ],
      variations: {
        formal: ['Pardon me, might you direct me to...'],
        informal: ['Hey, do you know where... is?'],
        regional: {
          us: {
            region: 'United States',
            phrases: ['blocks', 'take a right', 'gas station'],
            notes: 'Americans often use blocks as distance measure'
          },
          uk: {
            region: 'United Kingdom',
            phrases: ['turn right', 'petrol station', 'high street'],
            notes: 'British English uses different terms'
          },
          australia: {
            region: 'Australia',
            phrases: ['servo', 'bottle shop', 'arvo'],
            notes: 'Australian English has unique slang'
          }
        }
      },
      tags: ['travel', 'directions', 'polite']
    }
  ]
};

export const CATEGORIES = [
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: '🍽️',
    scenarios: ['Order at Restaurant', 'Buy Groceries', 'Order Coffee', 'Make Reservation']
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    scenarios: ['Take a Taxi', 'Use Public Transit', 'Rent a Car', 'Ask for Directions']
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    scenarios: ['Buy Clothes', 'Return Items', 'Ask for Size', 'Bargain at Market']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    scenarios: ['Visit Doctor', 'Buy Medicine', 'Emergency', 'Make Appointment']
  },
  {
    id: 'social',
    name: 'Social & Leisure',
    icon: '🎉',
    scenarios: ['Meet New People', 'Make Plans', 'Order Drinks', 'Join Activities']
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    icon: '🏨',
    scenarios: ['Check In Hotel', 'Report Issues', 'Ask for Amenities', 'Extend Stay']
  }
];