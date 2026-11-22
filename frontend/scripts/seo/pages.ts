/**
 * Content source for the static SEO landing pages. Nepali first, English
 * supporting text. Everything here is rendered visibly and mirrored into
 * JSON-LD, so a claim added here must be true of the product.
 */

export type Bilingual = { ne: string; en: string };

export type TypingLanguageId =
  | "nepali_unicode"
  | "nepali_traditional"
  | "nepali"
  | "nepali_1k"
  | "nepali_romanized"
  | "english";

export type LayoutName = "nepali_unicode_romanized" | "nepali_traditional";

export type Block =
  | { kind: "paragraph"; text: Bilingual }
  | { kind: "list"; ordered: boolean; items: Bilingual[] }
  | { kind: "modes" }
  | { kind: "examples"; layout: LayoutName; words: string[] }
  | { kind: "conjunctKeys"; layout: LayoutName }
  | { kind: "homeRow"; layout: LayoutName }
  | { kind: "keyChart"; layout: LayoutName };

export type Section = { id: string; heading: Bilingual; blocks: Block[] };

export type FaqItem = { question: Bilingual; answer: Bilingual };

export type LandingPage = {
  slug: string;
  languageId: TypingLanguageId;
  title: string;
  description: string;
  navLabel: Bilingual;
  h1: Bilingual;
  lead: Bilingual;
  sections: Section[];
  faq: FaqItem[];
  isMainPage: boolean;
};

export type TypingMode = {
  languageId: TypingLanguageId;
  name: Bilingual;
  summary: Bilingual;
  guideSlug?: string;
};

export const BRAND = {
  name: "Akshar",
  nameNe: "अक्षर",
  siteUrl: "https://akshar.rojanacharya.com",
  tagline: "A minimalistic Nepali typing test",
  taglineNe: "सरल नेपाली टाइपिङ टेस्ट",
  upstreamName: "Monkeytype",
  upstreamUrl: "https://github.com/monkeytypegame/monkeytype",
  license: "GPL-3.0",
  licenseUrl: "https://www.gnu.org/licenses/gpl-3.0.html",
  socialImage: { path: "/images/mtsocial.png", width: 1200, height: 630 },
  favicon: "/images/favicon/favicon.svg",
  appleTouchIcon: "/images/favicon/apple-touch-icon.png",
  themeColor: "#323437",
} as const;

export const CTA_LABEL: Bilingual = {
  ne: "अहिले टाइप गर्नुहोस्",
  en: "Start typing",
};

export const TYPING_MODES: TypingMode[] = [
  {
    languageId: "nepali_unicode",
    name: { ne: "नेपाली युनिकोड", en: "Nepali Unicode (romanized)" },
    summary: {
      ne: "अंग्रेजी अक्षरको आवाजअनुसार नेपाली टाइप गर्नुहोस्: n = न, k = क। कुनै पनि किबोर्डबाट चल्छ। पूर्वनिर्धारित मोड।",
      en: "Keys follow the sound of the letter: n types न, k types क. Works from any keyboard. This is the default mode.",
    },
    guideSlug: "nepali-unicode-typing",
  },
  {
    languageId: "nepali_traditional",
    name: { ne: "नेपाली ट्रेडिसनल", en: "Nepali Traditional" },
    summary: {
      ne: "पुरानो टाइपराइटर शैलीको लेआउट। Q थिच्दा त्र, होम रोमा ब क म ा न ज व प ि स ु।",
      en: "The typewriter-style layout. Q types त्र and the home row is ब क म ा न ज व प ि स ु.",
    },
    guideSlug: "nepali-traditional-typing",
  },
  {
    languageId: "nepali",
    name: { ne: "नेपाली (आफ्नै किबोर्ड)", en: "Nepali (your own keyboard)" },
    summary: {
      ne: "तपाईंको कम्प्युटर वा फोनमा नेपाली किबोर्ड वा IME छ भने यो मोड प्रयोग गर्नुहोस्। २०० सामान्य शब्द।",
      en: "Use the Nepali keyboard or IME already installed on your computer or phone. 200 common words.",
    },
  },
  {
    languageId: "nepali_1k",
    name: {
      ne: "नेपाली १००० (आफ्नै किबोर्ड)",
      en: "Nepali 1k (your own keyboard)",
    },
    summary: {
      ne: "आफ्नै नेपाली किबोर्डसँग १००० सामान्य शब्दको अभ्यास।",
      en: "The same as above with 1000 common Nepali words.",
    },
  },
  {
    languageId: "nepali_romanized",
    name: { ne: "रोमन नेपाली", en: "Romanized Nepali" },
    summary: {
      ne: "नेपाली शब्द ल्याटिन अक्षरमा, जस्तै aaja, aakash।",
      en: "Nepali words written in Latin letters, such as aaja and aakash.",
    },
  },
  {
    languageId: "english",
    name: { ne: "अंग्रेजी", en: "English" },
    summary: {
      ne: "२०० सामान्य अंग्रेजी शब्दसँग अंग्रेजी टाइपिङ टेस्ट।",
      en: "An English typing test with 200 common English words.",
    },
    guideSlug: "english-typing-test",
  },
];

const WPM_ANSWER: Bilingual = {
  ne: "सही टाइप गरिएका शब्दका अक्षर (स्पेससहित) गनिन्छ, ५ ले भाग गरिन्छ, अनि मिनेटले भाग गरिन्छ। हरेक युनिकोड अक्षर गनिन्छ, त्यसैले क्ष तीन अक्षर हो: क, ् र ष।",
  en: "Akshar counts the characters of correctly typed words, spaces included, divides by 5, then divides by the minutes taken. Every Unicode character counts, so क्ष is three characters: क, ् and ष.",
};

const MAIN_FAQ: FaqItem[] = [
  {
    question: {
      ne: "के मलाई नेपाली किबोर्ड इन्स्टल गर्नुपर्छ?",
      en: "Do I need a Nepali keyboard installed?",
    },
    answer: {
      ne: 'पर्दैन। युनिकोड र ट्रेडिसनल मोडमा अक्षरले साधारण अंग्रेजी (QWERTY) किबोर्डका कुञ्जीलाई ब्राउजरभित्रै नेपाली अक्षरमा बदल्छ। आफ्नो कम्प्युटरमा पहिले नै नेपाली किबोर्ड वा IME चलाउनुहुन्छ भने "नेपाली (आफ्नै किबोर्ड)" मोड छान्नुहोस्।',
      en: 'No. In the Unicode and Traditional modes Akshar turns the keys of a normal English (QWERTY) keyboard into Nepali letters inside the browser. If you already use a Nepali keyboard or IME on your computer, pick the "Nepali (your own keyboard)" mode instead.',
    },
  },
  {
    question: {
      ne: "युनिकोड, ट्रेडिसनल र प्रीतिमा के फरक छ?",
      en: "What is the difference between Unicode, Traditional and Preeti?",
    },
    answer: {
      ne: "युनिकोड (रोमनाइज्ड) लेआउटमा अक्षर मिल्दो आवाजको कुञ्जीमा हुन्छ: n = न। ट्रेडिसनल लेआउटले पुरानो टाइपराइटर शैलीको स्थान राख्छ। प्रीति युनिकोड होइन, पुरानो फन्ट हो: त्यो फन्ट नभएको ठाउँमा प्रीतिमा लेखेको पाठ अंग्रेजी अक्षरजस्तो देखिन्छ। अक्षरले सधैं मानक युनिकोड देवनागरी टाइप गर्छ।",
      en: "The Unicode (romanized) layout puts each letter on the key that sounds like it: n types न. The Traditional layout keeps the older typewriter-style key positions. Preeti is not Unicode. It is a legacy font, so text typed with it shows up as Latin letters wherever that font is missing. Akshar always types standard Unicode Devanagari.",
    },
  },
  {
    question: {
      ne: "WPM कसरी गनिन्छ?",
      en: "How is WPM counted?",
    },
    answer: WPM_ANSWER,
  },
  {
    question: {
      ne: "के अक्षर नि:शुल्क छ? साइन अप चाहिन्छ?",
      en: "Is Akshar free? Do I need to sign up?",
    },
    answer: {
      ne: "नि:शुल्क छ। खाता वा साइन अप चाहिँदैन। साइट खोल्नुहोस् र टाइप गर्न थाल्नुहोस्।",
      en: "Yes, it is free. There is no account and no sign up. Open the site and start typing.",
    },
  },
  {
    question: {
      ne: "के मेरो डाटा ब्राउजरबाट बाहिर जान्छ?",
      en: "Does my data leave my browser?",
    },
    answer: {
      ne: "जाँदैन। नतिजा र सेटिङ यही उपकरणको ब्राउजरमा (localStorage) सुरक्षित हुन्छन्। साइट डाटा मेटाउँदा ती पनि मेटिन्छन्।",
      en: "No. Results and settings are stored in your browser's localStorage on this device. Clearing the site data removes them.",
    },
  },
  {
    question: {
      ne: "अक्षर र Monkeytype को के सम्बन्ध छ?",
      en: "How is Akshar related to Monkeytype?",
    },
    answer: {
      ne: "अक्षर Monkeytype को खुला स्रोत (GPL-3.0) फोर्क हो, नेपाली टाइपिङका लागि बनाइएको।",
      en: "Akshar is an open source fork of Monkeytype under the GPL-3.0 license, built for Nepali typing.",
    },
  },
];

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "nepali-typing-test",
    languageId: "nepali_unicode",
    isMainPage: true,
    title: "नेपाली टाइपिङ टेस्ट | Nepali Typing Test | Akshar",
    description:
      "नि:शुल्क नेपाली टाइपिङ टेस्ट। Free Nepali typing test in Unicode, Traditional or your own Nepali keyboard. No sign up. Check your WPM and accuracy.",
    navLabel: { ne: "टाइपिङ टेस्ट", en: "Typing test" },
    h1: { ne: "नेपाली टाइपिङ टेस्ट", en: "Nepali typing test" },
    lead: {
      ne: "अक्षर एउटा सरल नेपाली टाइपिङ टेस्ट हो। कुनै पनि किबोर्डबाट देवनागरी टाइप गर्नुहोस् र आफ्नो गति (WPM) र शुद्धता हेर्नुहोस्।",
      en: "Akshar is a minimalistic Nepali typing test. Type Devanagari from any keyboard and see your speed (WPM) and accuracy.",
    },
    sections: [
      {
        id: "modes",
        heading: { ne: "टाइपिङ मोडहरू", en: "Typing modes" },
        blocks: [{ kind: "modes" }],
      },
      {
        id: "how-to-start",
        heading: { ne: "कसरी सुरु गर्ने", en: "How to start" },
        blocks: [
          {
            kind: "list",
            ordered: true,
            items: [
              {
                ne: "माथिको सूचीबाट मोड छान्नुहोस्। थाहा छैन भने नेपाली युनिकोडबाट सुरु गर्नुहोस्।",
                en: "Pick a mode from the list above. If unsure, start with Nepali Unicode.",
              },
              {
                ne: '"अहिले टाइप गर्नुहोस्" थिच्नुहोस्। पहिलो कुञ्जी थिच्नेबित्तिकै टेस्ट सुरु हुन्छ।',
                en: 'Press "Start typing". The test starts on your first keystroke.',
              },
              {
                ne: "टेस्ट सकिएपछि WPM, शुद्धता र अक्षरको हिसाब हेर्नुहोस्।",
                en: "When the test ends, read your WPM, accuracy and character counts.",
              },
            ],
          },
        ],
      },
    ],
    faq: MAIN_FAQ,
  },
  {
    slug: "nepali-unicode-typing",
    languageId: "nepali_unicode",
    isMainPage: false,
    title: "नेपाली युनिकोड टाइपिङ | Nepali Unicode Typing Practice | Akshar",
    description:
      "नेपाली युनिकोड (रोमनाइज्ड) किबोर्डको पूरा चार्ट र अभ्यास। Nepali Unicode romanized keyboard chart and typing practice from any keyboard. Free, no install.",
    navLabel: { ne: "युनिकोड", en: "Unicode" },
    h1: { ne: "नेपाली युनिकोड टाइपिङ", en: "Nepali Unicode typing" },
    lead: {
      ne: "नेपाली युनिकोड (रोमनाइज्ड) लेआउटमा हरेक कुञ्जीले मिल्दो आवाजको नेपाली अक्षर टाइप गर्छ। अक्षरले यो लेआउट ब्राउजरमै चलाउँछ, त्यसैले केही इन्स्टल गर्नु पर्दैन।",
      en: "In the Nepali Unicode (romanized) layout each key types the Nepali letter that sounds like it. Akshar runs this layout inside the browser, so there is nothing to install.",
    },
    sections: [
      {
        id: "how-it-works",
        heading: { ne: "यो कसरी काम गर्छ", en: "How it works" },
        blocks: [
          {
            kind: "paragraph",
            text: {
              ne: "साधारण कुञ्जीले मूल अक्षर दिन्छ, Shift सँग महाप्राण वा दीर्घ रूप आउँछ: k = क, Shift + K = ख; i = ि, Shift + I = ी। आधा अक्षर बनाउन / कुञ्जीले हलन्त (्) थप्नुहोस्।",
              en: "A plain key gives the base letter and Shift gives the aspirated or long form: k types क and Shift + K types ख; i types ि and Shift + I types ी. To join consonants, add a halant (्) with the / key.",
            },
          },
          {
            kind: "examples",
            layout: "nepali_unicode_romanized",
            words: ["नेपाल", "नमस्ते", "धन्यवाद", "क्षमा"],
          },
        ],
      },
      {
        id: "key-chart",
        heading: { ne: "पूरा कुञ्जी चार्ट", en: "Full key chart" },
        blocks: [
          {
            kind: "paragraph",
            text: {
              ne: "बायाँ स्तम्भमा अमेरिकी QWERTY किबोर्डको कुञ्जी छ। ◌ ले मात्रा वा चिह्न जनाउँछ जुन अघिल्लो अक्षरमा जोडिन्छ।",
              en: "The left column is the key on a US QWERTY keyboard. ◌ marks a vowel sign or mark that joins the letter before it.",
            },
          },
          { kind: "keyChart", layout: "nepali_unicode_romanized" },
        ],
      },
    ],
    faq: [],
  },
  {
    slug: "nepali-traditional-typing",
    languageId: "nepali_traditional",
    isMainPage: false,
    title: "ट्रेडिसनल नेपाली टाइपिङ | Nepali Traditional Keyboard | Akshar",
    description:
      "ट्रेडिसनल नेपाली किबोर्डको पूरा चार्ट, संयुक्त अक्षरसहित। Nepali Traditional keyboard layout chart with conjunct keys and free typing practice.",
    navLabel: { ne: "ट्रेडिसनल", en: "Traditional" },
    h1: { ne: "ट्रेडिसनल नेपाली टाइपिङ", en: "Nepali Traditional typing" },
    lead: {
      ne: "ट्रेडिसनल लेआउटले पुरानो टाइपराइटर शैलीको कुञ्जी स्थान राख्छ। प्रीतिमा टाइप गर्न सिक्नुभएको छ भने यो लेआउट चिनेजस्तो लाग्न सक्छ, तर अक्षरले मानक युनिकोड टाइप गर्छ।",
      en: "The Traditional layout keeps the older typewriter-style key positions. If you learned to type with Preeti it may feel familiar, but Akshar types standard Unicode.",
    },
    sections: [
      {
        id: "how-it-works",
        heading: { ne: "यो कसरी काम गर्छ", en: "How it works" },
        blocks: [
          { kind: "homeRow", layout: "nepali_traditional" },
          {
            kind: "examples",
            layout: "nepali_traditional",
            words: ["नमस्ते", "त्रिभुवन", "नेपाल"],
          },
        ],
      },
      {
        id: "conjunct-keys",
        heading: { ne: "संयुक्त अक्षरका कुञ्जी", en: "Conjunct keys" },
        blocks: [
          {
            kind: "paragraph",
            text: {
              ne: "केही कुञ्जीले एकै पटक पूरा संयुक्त अक्षर वा आधा अक्षर टाइप गर्छन्। टेस्टमा यी एक कुञ्जी हुन्, तर WPM मा हरेक युनिकोड अक्षर गनिन्छ।",
              en: "Some keys type a whole conjunct or half letter in one press. In the test they are one key, but WPM still counts every Unicode character in them.",
            },
          },
          { kind: "conjunctKeys", layout: "nepali_traditional" },
        ],
      },
      {
        id: "key-chart",
        heading: { ne: "पूरा कुञ्जी चार्ट", en: "Full key chart" },
        blocks: [
          {
            kind: "paragraph",
            text: {
              ne: "बायाँ स्तम्भमा अमेरिकी QWERTY किबोर्डको कुञ्जी छ। ◌ ले मात्रा वा चिह्न जनाउँछ जुन अघिल्लो अक्षरमा जोडिन्छ।",
              en: "The left column is the key on a US QWERTY keyboard. ◌ marks a vowel sign or mark that joins the letter before it.",
            },
          },
          { kind: "keyChart", layout: "nepali_traditional" },
        ],
      },
    ],
    faq: [],
  },
  {
    slug: "nepali-typing-practice",
    languageId: "nepali_unicode",
    isMainPage: false,
    title: "नेपाली टाइपिङ अभ्यास | Nepali Typing Practice Tips | Akshar",
    description:
      "नेपाली टाइपिङ गति र शुद्धता बढाउने तरिका। How to practise Nepali typing, improve speed and accuracy, and how WPM works for Devanagari.",
    navLabel: { ne: "अभ्यास", en: "Practice" },
    h1: { ne: "नेपाली टाइपिङ अभ्यास", en: "Nepali typing practice" },
    lead: {
      ne: "छिटो टाइप गर्न पहिले शुद्ध टाइप गर्न सिक्नुहोस्। यहाँ नियमित अभ्यासका सजिला तरिका र देवनागरीमा WPM कसरी गनिन्छ भन्ने छ।",
      en: "To type fast, first learn to type accurately. Here are simple habits for regular practice and how WPM is counted for Devanagari.",
    },
    sections: [
      {
        id: "tips",
        heading: {
          ne: "गति र शुद्धता बढाउने तरिका",
          en: "How to improve speed and accuracy",
        },
        blocks: [
          {
            kind: "list",
            ordered: false,
            items: [
              {
                ne: "पहिले शुद्धता: गल्ती कम भएपछि मात्र गति बढाउनुहोस्।",
                en: "Accuracy first. Push for speed only once mistakes are rare.",
              },
              {
                ne: "किबोर्ड नहेरी टाइप गर्नुहोस्। औंला होम रोमा राख्नुहोस्।",
                en: "Do not look at the keyboard. Keep your fingers on the home row.",
              },
              {
                ne: "लामो सत्रभन्दा छोटो तर दैनिक अभ्यास गर्नुहोस्।",
                en: "Practise a little every day rather than in rare long sessions.",
              },
              {
                ne: "मात्रा र आधा अक्षर (्) छुट्टै अभ्यास गर्नुहोस्। तिनैमा धेरै गल्ती हुन्छ।",
                en: "Drill vowel signs and half letters (्) on their own, since they cause many mistakes.",
              },
              {
                ne: "एउटै लम्बाइको टेस्ट दोहोर्याउनुहोस् ताकि नतिजा तुलना गर्न सकियोस्।",
                en: "Repeat tests of the same length so your results are comparable.",
              },
            ],
          },
        ],
      },
      {
        id: "wpm",
        heading: { ne: "देवनागरीमा WPM", en: "WPM for Devanagari" },
        blocks: [
          { kind: "paragraph", text: WPM_ANSWER },
          {
            kind: "paragraph",
            text: {
              ne: "उदाहरण: नमस्ते मा ६ युनिकोड अक्षर छन् (न म स ् त े)। त्यसैले नेपाली WPM र अंग्रेजी WPM सिधै तुलना गर्न मिल्दैन। आफ्नै पुराना नतिजासँग तुलना गर्नुहोस्।",
              en: "Example: नमस्ते has 6 Unicode characters (न म स ् त े). So a Nepali WPM and an English WPM are not directly comparable. Compare against your own earlier results.",
            },
          },
          {
            kind: "paragraph",
            text: {
              ne: "शुद्धता भनेको सही थिचिएका कुञ्जीको प्रतिशत हो।",
              en: "Accuracy is the share of keystrokes that were correct.",
            },
          },
        ],
      },
    ],
    faq: [],
  },
  {
    slug: "english-typing-test",
    languageId: "english",
    isMainPage: false,
    title: "English Typing Test | अंग्रेजी टाइपिङ टेस्ट | Akshar",
    description:
      "Free English typing test with 200 common words. अंग्रेजी टाइपिङ टेस्ट। Check your WPM and accuracy, no sign up, and switch to Nepali anytime.",
    navLabel: { ne: "अंग्रेजी", en: "English" },
    h1: { ne: "अंग्रेजी टाइपिङ टेस्ट", en: "English typing test" },
    lead: {
      ne: "अक्षरमा अंग्रेजी टाइपिङ टेस्ट पनि छ। नेपाली र अंग्रेजी दुवैको अभ्यास एउटै ठाउँमा गर्नुहोस्।",
      en: "Akshar also has an English typing test, so you can practise Nepali and English in one place.",
    },
    sections: [
      {
        id: "how-it-works",
        heading: { ne: "यो कसरी काम गर्छ", en: "How it works" },
        blocks: [
          {
            kind: "list",
            ordered: false,
            items: [
              {
                ne: "२०० सामान्य अंग्रेजी शब्दबाट टेस्ट बनाइन्छ।",
                en: "Tests are built from 200 common English words.",
              },
              {
                ne: "WPM नेपाली मोडजस्तै गनिन्छ: अक्षर ÷ ५ ÷ मिनेट।",
                en: "WPM is counted the same way as in the Nepali modes: characters ÷ 5 ÷ minutes.",
              },
              {
                ne: "सेटिङबाट जुनसुकै बेला नेपाली मोडमा फर्कन सकिन्छ।",
                en: "Switch back to a Nepali mode from the settings at any time.",
              },
            ],
          },
        ],
      },
    ],
    faq: [],
  },
];
