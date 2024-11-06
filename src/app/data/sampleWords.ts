import { WordWithTranslations } from "./types/dictionary";

export const sampleWords: WordWithTranslations[] = [
  {
    term: "Umuundu",
    definition: {
      kifuliiru:
        "Umundu mu bulya ali mutwali mukulu weꞌkyaro, ye mu yimangira ibyaro mu mihugo.",
      english:
        "A person in the community who plays a significant role in social gatherings and cultural events.",
      french:
        "Une personne de la communauté qui joue un rôle important dans les rassemblements sociaux et les événements culturels.",
      swahili:
        "Mtu katika jamii anayechukua jukumu muhimu katika mikutano ya kijamii na matukio ya kitamaduni.",
    },
    date: "2024-10-01",
    audioTermUrl: "/audio/umuundu-term.mp3",
    audioDefinitionUrl: "/audio/umuundu-definition.mp3",
    partOfSpeech: "noun",
    examples: [
      {
        kifuliiru: "Umuundu akola mu kyaro kyitu",
        english: "The community elder is an umuundu",
        french: "L'ancien de la communauté est un umuundu",
        swahili: "Mzee wa jamii ni umuundu",
      },
      {
        kifuliiru: "Umuundu atusomesa eminwa",
        english: "The umuundu leads the ceremony",
        french: "L'umuundu dirige la cérémonie",
        swahili: "Umuundu anaongoza sherehe",
      },
    ],
    dialect: "Central Kifuliiru",
  },
  {
    term: "Ukulya bwija",
    definition: {
      kifuliiru:
        "Ukumenya ukulya ibyokulya íbikwaniini, halinde umubiri gukizi kana.",
      english:
        "A practice of eating in a healthy and balanced way that promotes well-being.",
      french:
        "Une pratique consistant à manger de manière saine et équilibrée qui favorise le bien-être.",
      swahili:
        "Desturi ya kula kwa njia ya afya na usawa ambayo inaendeleza ustawi.",
    },
    date: "2024-10-10",
    audioTermUrl: "/audio/ukulya-bwija-term.mp3",
    audioDefinitionUrl: "/audio/ukulya-bwija-definition.mp3",
    partOfSpeech: "phrase",
    examples: [
      {
        kifuliiru: "Ukulya bwija buli lusiku",
        english: "Practice ukulya bwija for good health",
        french: "Pratiquez ukulya bwija pour une bonne santé",
        swahili: "Fanya ukulya bwija kwa afya njema",
      },
      {
        kifuliiru: "Ukulya bwija kutuha amagara",
        english: "Ukulya bwija is important for children",
        french: "Ukulya bwija est important pour les enfants",
        swahili: "Ukulya bwija ni muhimu kwa watoto",
      },
    ],
    dialect: "Southern Kifuliiru",
  },
];
