import { Person, MapLocation, MigrationPath, TerritoryArea } from '../types/genealogy';

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 'adam',
    name: 'Adam',
    hebrewName: 'אָדָם',
    hebrewMeaning: 'Om, omenire, pământ roșu (adama)',
    gender: 'male',
    generation: 1,
    chronologicalOrder: 1,
    parents: [],
    spouses: ['eva'],
    children: ['cain', 'abel', 'set'],
    lifespanYears: 930,
    birthYearAM: 0,
    deathYearAM: 930,
    primaryLocationId: 'eden',
    summary: 'Primul om creat de Dumnezeu din țărâna pământului și așezat în Grădina Edenului pentru a o lucra și a o păzi.',
    biography: [
      'Creat în ziua a șasea a creației după chipul și asemănarea lui Dumnezeu.',
      'A numit toate viețuitoarele pământului și ale văzduhului în Grădina Edenului.',
      'După neascultare și consumarea rodului pomului cunoștinței binelui și răului, a fost izgonit din Eden pentru a munci pământul cu sudoarea frunții.',
      'Tatăl lui Cain, Abel și Set, precum și al altor fii și fiice nenominalizați în textul canonic.',
      'A trăit 930 de ani conform cronologiei masoretice.'
    ],
    keyEvents: [
      { event: 'Creația omului din țărâna pământului', reference: 'Geneza 2:7', yearAM: 0 },
      { event: 'Numirea viețuitoarelor și unirea cu Eva', reference: 'Geneza 2:19-24', yearAM: 0 },
      { event: 'Căderea și izgonirea din Eden', reference: 'Geneza 3:23-24', yearAM: 1 },
      { event: 'Nașterea primilor fii: Cain și Abel', reference: 'Geneza 4:1-2', yearAM: 2 },
      { event: 'Nașterea lui Set la vârsta de 130 de ani', reference: 'Geneza 5:3', yearAM: 130 },
      { event: 'Trecerea din viață la vârsta de 930 de ani', reference: 'Geneza 5:5', yearAM: 930 }
    ],
    sources: [
      {
        book: 'Geneza',
        chapterVerses: '1:26-27',
        textSnippet: 'Apoi Dumnezeu a zis: „Să facem om după chipul Nostru, după asemănarea Noastră; el să stăpânească peste peștii mării, peste păsările cerului, peste vite, peste tot pământul și peste toate târâtoarele care se mișcă pe pământ.”',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '2:7',
        textSnippet: 'Domnul Dumnezeu a făcut pe om din țărâna pământului, i-a suflat în nări suflare de viață, și omul s-a făcut astfel un suflet viu.',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '5:3-5',
        textSnippet: 'La vârsta de o sută treizeci de ani, Adam a născut un fiu după chipul și asemănarea lui, și i-a pus numele Set. Zilele pe care le-a trăit Adam după nașterea lui Set au fost de opt sute de ani; și a născut fii și fiice. Toate zilele pe care le-a trăit Adam au fost de nouă sute treizeci de ani; apoi a murit.',
        tradition: 'Masoretic'
      },
      {
        book: 'Iosif Flaviu - Antichități Iudaice',
        chapterVerses: 'Cartea I, Cap. 1',
        textSnippet: 'Acest om a fost numit Adam, ceea ce în limba ebraică înseamnă cel roșu, fiindcă a fost plămădit din pământ roșu frământat, căci acesta este pământul virgin și curat.',
        tradition: 'Josephus'
      }
    ],
    lineage: 'Adamic',
    occupation: 'Păzitor și lucrător al Edenului; agricultor după cădere'
  },
  {
    id: 'eva',
    name: 'Eva',
    hebrewName: 'חַוָּה (Chavah)',
    hebrewMeaning: 'Dătătoare de viață, mama tuturor celor vii (chayah)',
    gender: 'female',
    generation: 1,
    chronologicalOrder: 2,
    parents: [],
    spouses: ['adam'],
    children: ['cain', 'abel', 'set'],
    summary: 'Prima femeie creată de Dumnezeu din coasta lui Adam ca ajutor potrivit pentru el; mama întregii specii umane.',
    biography: [
      'Adusă la viață ca partener egal și ajutor potrivit pentru Adam în Grădina Edenului.',
      'Numită inițial „Ișah” (femeie, luată din bărbat), iar ulterior Adam i-a dat numele Eva (Chavah), pentru că este mama tuturor celor vii.',
      'A fost ademenită de șarpe să guste din pomul oprit, oferindu-i și soțului ei.',
      'După cădere, a născut pe Cain spunând: „Am dobândit un om cu ajutorul Domnului”, apoi pe Abel și, după uciderea acestuia, pe Set.'
    ],
    keyEvents: [
      { event: 'Formarea din coasta lui Adam', reference: 'Geneza 2:21-22', yearAM: 0 },
      { event: 'Ispitirea și căderea în neascultare', reference: 'Geneza 3:1-6', yearAM: 1 },
      { event: 'Primirea numelui de Chavah (Eva)', reference: 'Geneza 3:20', yearAM: 1 },
      { event: 'Nașterea lui Cain', reference: 'Geneza 4:1', yearAM: 2 },
      { event: 'Nașterea lui Set după moartea lui Abel', reference: 'Geneza 4:25', yearAM: 130 }
    ],
    sources: [
      {
        book: 'Geneza',
        chapterVerses: '2:21-23',
        textSnippet: 'Atunci Domnul Dumnezeu a trimis un somn adânc peste om, și omul a adormit; Domnul a luat una din coastele lui și a închis carnea la locul ei. Din coasta pe care o luase din om, Domnul Dumnezeu a făcut o femeie și a adus-o la om.',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '3:20',
        textSnippet: 'Adam a pus nevestei sale numele Eva: căci ea a fost mama tuturor celor vii.',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '4:25',
        textSnippet: 'Adam s-a împreunat iarăși cu nevasta sa; ea a născut un fiu, și i-a pus numele Set; „căci”, a zis ea, „Dumnezeu mi-a dat o altă sămânță în locul lui Abel, pe care l-a ucis Cain.”',
        tradition: 'Masoretic'
      },
      {
        book: 'Cartea Jubileelor',
        chapterVerses: 'Cap. 3:1-8',
        textSnippet: 'În a doua săptămână a primei luni a fost creată femeia și adusă în fața lui Adam, iar Adam a primit-o cu bucurie ca oase din oasele sale.',
        tradition: 'Jubilees'
      }
    ],
    lineage: 'Adamic',
    occupation: 'Mama tuturor celor vii; ocrotitoarea primului cămin'
  },
  {
    id: 'cain',
    name: 'Cain',
    hebrewName: 'קַיִן (Qayin)',
    hebrewMeaning: 'Dobândit, căpătat, făurit sau suliță',
    gender: 'male',
    generation: 2,
    chronologicalOrder: 3,
    parents: ['adam', 'eva'],
    spouses: ['Awan (tradiție Jubileele)'],
    children: ['enoh_cain'],
    primaryLocationId: 'nod',
    summary: 'Întâiul născut al omenirii, agricultor de profesie, primul făptuitor de fratricid din istorie și fondatorul primei cetăți numite Enoh.',
    biography: [
      'Primul om născut prin naștere naturală din părinți umani.',
      'S-a îndeletnicit cu lucrarea pământului și a adus Domnului o jertfă din roadele câmpului.',
      'Cuprins de invidie și mânie că jertfa fratelui său Abel a fost privită cu bunăvoință, l-a ucis pe acesta pe câmp.',
      'Dumnezeu a rostit un blestem asupra lui: pământul nu-și va mai da rodul pentru el și a devenit un pribeag rătăcitor.',
      'A primit un semn protector divin („semnul lui Cain”) pentru a nu fi omorât.',
      'S-a stabilit la răsărit de Eden în Ținutul Nod, unde a întemeiat prima așezare urbană consemnată, cetatea Enoh.'
    ],
    keyEvents: [
      { event: 'Nașterea întâiului fiu al Evei', reference: 'Geneza 4:1', yearAM: 2 },
      { event: 'Aducerea jertfei neacceptate din roadele câmpului', reference: 'Geneza 4:3-5', yearAM: 30 },
      { event: 'Uciderea lui Abel pe câmp', reference: 'Geneza 4:8', yearAM: 100 },
      { event: 'Judecata divină și primirea semnului de protecție', reference: 'Geneza 4:11-15', yearAM: 100 },
      { event: 'Migrația în Ținutul Nod și întemeierea cetății Enoh', reference: 'Geneza 4:16-17', yearAM: 110 }
    ],
    sources: [
      {
        book: 'Geneza',
        chapterVerses: '4:1-2',
        textSnippet: 'Adam s-a împreunat cu nevasta sa Eva; ea a rămas însărcinată și a născut pe Cain. Și a zis: „Am căpătat un om cu ajutorul Domnului!” A mai născut și pe fratele său Abel. Abel era cioban, iar Cain era plugar.',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '4:16-17',
        textSnippet: 'Apoi Cain a ieșit din fața Domnului și a locuit în țara Nod, la răsărit de Eden. Cain s-a împreunat cu nevasta sa; ea a rămas însărcinată și a născut pe Enoh. El a început apoi să zidească o cetate și a pus acestei cetăți numele fiului său: Enoh.',
        tradition: 'Masoretic'
      },
      {
        book: 'Iosif Flaviu - Antichități Iudaice',
        chapterVerses: 'Cartea I, Cap. 2',
        textSnippet: 'Cain nu s-a îndreptat prin această pedeapsă, ci a devenit și mai rău. A adunat averi prin jaf și violență, învățându-și tovarășii să fie ticăloși. A fost primul care a pus hotare pământului și a construit o cetate întărită.',
        tradition: 'Josephus'
      }
    ],
    lineage: 'Cainite',
    occupation: 'Plugar / Agricultor primordial; ulterior constructor de cetăți'
  },
  {
    id: 'abel',
    name: 'Abel',
    hebrewName: 'הֶבֶל (Hevel)',
    hebrewMeaning: 'Suflare, vapori, deșertăciune sau fragilitate tranzitorie',
    gender: 'male',
    generation: 2,
    chronologicalOrder: 4,
    parents: ['adam', 'eva'],
    children: [],
    lifespanYears: 100,
    deathYearAM: 100,
    primaryLocationId: 'eden',
    summary: 'Al doilea fiu al lui Adam și Eva, păstor de oi credincios, a adus o jertfă privită cu bunăvoință de Dumnezeu și a devenit primul martir al umanității.',
    biography: [
      'Al doilea copil al primilor oameni, a ales vocația de păstor al turmelor.',
      'A adus lui Dumnezeu o jertfă din întâii născuți ai turmei sale și din grăsimea lor, jertfă primită cu favoare pentru curăția inimii și credința sa.',
      'A fost ademenit pe câmp de fratele său mai mare Cain și asasinat din gelozie.',
      'Sângele lui a strigat din pământ către Dumnezeu cerând dreptate divină.',
      'Este menționat în Noul Testament ca model de credință și prototip al neprihănitului (Evrei 11:4).'
    ],
    keyEvents: [
      { event: 'Nașterea ca al doilea fiu', reference: 'Geneza 4:2', yearAM: 3 },
      { event: 'Aducerea jertfei din întâii născuți ai turmei', reference: 'Geneza 4:4', yearAM: 30 },
      { event: 'Martiriul prin fratricid pe câmp', reference: 'Geneza 4:8', yearAM: 100 }
    ],
    sources: [
      {
        book: 'Geneza',
        chapterVerses: '4:2-5',
        textSnippet: 'Abel era cioban, iar Cain era plugar. După o bucată de vreme, Cain a adus Domnului o jertfă de mâncare din roadele pământului. Abel a adus și el o jertfă de mâncare din oile întâi născute ale turmei lui și din grăsimea lor. Domnul a privit cu plăcere spre Abel și spre jertfa lui.',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '4:10',
        textSnippet: 'Și Dumnezeu a zis: „Ce ai făcut? Glasul sângelui fratelui tău strigă din pământ la Mine!”',
        tradition: 'Masoretic'
      },
      {
        book: 'Epistola către Evrei',
        chapterVerses: '11:4',
        textSnippet: 'Prin credință a adus Abel lui Dumnezeu o jertfă mai bună decât a lui Cain. Prin ea a căpătat el mărturia că este neprihănit, căci Dumnezeu a primit darurile lui; și prin ea vorbește el încă, măcar că este mort.',
        tradition: 'Septuagint'
      }
    ],
    lineage: 'Adamic',
    occupation: 'Păstor de oi și turme'
  },
  {
    id: 'set',
    name: 'Set',
    hebrewName: 'שֵׁת (Sheth)',
    hebrewMeaning: 'Rânduit, numit, așezat în loc, compensație divină',
    gender: 'male',
    generation: 2,
    chronologicalOrder: 5,
    parents: ['adam', 'eva'],
    spouses: ['Azura (tradiție Jubileele)'],
    children: ['enos'],
    lifespanYears: 912,
    birthYearAM: 130,
    deathYearAM: 1042,
    primaryLocationId: 'mesopotamia',
    summary: 'Al treilea fiu consemnat al lui Adam și Eva, născut ca înlocuitor pentru Abel; strămoșul liniei patriarhale neprihănite ce duce spre Noe și Avraam.',
    biography: [
      'Născut când Adam avea 130 de ani (sau 230 în Septuaginta), după doliul provocat de pierderea lui Abel.',
      'Eva a proclamat: „Dumnezeu mi-a dat o altă sămânță în locul lui Abel, pe care l-a ucis Cain”.',
      'A devenit tatăl lui Enos la vârsta de 105 ani.',
      'În timpul vieții sale și a fiului său Enos, oamenii au început să cheme Numele Domnului în rugăciune publică.',
      'A trăit o viață pioasă de 912 ani, asigurând transmiterea memoriei creației și a preceptelor divine către generațiile următoare.'
    ],
    keyEvents: [
      { event: 'Nașterea la 130 de ani după crearea lui Adam', reference: 'Geneza 4:25, 5:3', yearAM: 130 },
      { event: 'Nașterea fiului său Enos', reference: 'Geneza 5:6', yearAM: 235 },
      { event: 'Începutul invocării Numelui Domnului', reference: 'Geneza 4:26', yearAM: 235 },
      { event: 'Moartea la venerabila vârstă de 912 ani', reference: 'Geneza 5:8', yearAM: 1042 }
    ],
    sources: [
      {
        book: 'Geneza',
        chapterVerses: '4:25-26',
        textSnippet: 'Adam s-a împreunat iarăși cu nevasta sa; ea a născut un fiu și i-a pus numele Set: „căci”, a zis ea, „Dumnezeu mi-a dat o altă sămânță în locul lui Abel, pe care l-a ucis Cain.” Lui Set i s-a născut și lui un fiu și i-a pus numele Enos. Atunci au început oamenii să cheme Numele Domnului.',
        tradition: 'Masoretic'
      },
      {
        book: 'Geneza',
        chapterVerses: '5:6-8',
        textSnippet: 'La vârsta de o sută cinci ani, Set a născut pe Enos. După nașterea lui Enos, Set a mai trăit opt sute șapte ani; și a născut fii și fiice. Toate zilele lui Set au fost de nouă sute doisprezece ani; apoi a murit.',
        tradition: 'Masoretic'
      },
      {
        book: 'Iosif Flaviu - Antichități Iudaice',
        chapterVerses: 'Cartea I, Cap. 2:3',
        textSnippet: 'Set, după ce a crescut și a ajuns la vârsta chibzuinței, a urmat virtutea și a lăsat în urmă urmași care i-au imitat buna purtare. Ei au descoperit știința corpurilor cerești și ordinea lor pe cer.',
        tradition: 'Josephus'
      }
    ],
    lineage: 'Sethite',
    occupation: 'Păstrător al tradiției sacre și patriarh al credinței'
  }
];

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'eden',
    name: 'Grădina Edenului',
    biblicalName: 'גַּן־עֵדֶן (Gan Eden)',
    hebrewName: 'Eden (Deliciu, desfătare)',
    type: 'garden',
    coordinates: { x: 58.5, y: 64.0 }, // Near confluence of rivers in lower Mesopotamia on parchment
    satelliteCoordinates: { x: 63.17, y: 32.78 }, // Delta confluence in southern Iraq / Persian Gulf
    regionalCoordinates: { x: 54.8, y: 52.0 }, // 1km/px HD regional map
    associatedPersonIds: ['adam', 'eva', 'abel'],
    period: 'Epoca Creației (AM 0 - 1)',
    description: 'Raiul terestru plantat de Dumnezeu la răsărit, udat de un râu care se despărțea în patru brațe: Pison, Ghihon, Hidechel (Tigru) și Perat (Eufrat).',
    biblicalReference: 'Geneza 2:8-15',
    significance: 'Leagănul originar al omenirii, locul comuniunii directe dintre om și Creator înainte de căderea în păcat.',
    archaeologicalNotes: 'Tradiția istorică și geografia biblică asociază regiunea cu delta fertilă formată de confluența Tigrului și Eufratului la vărsarea în Golful Persic (Eridu primordial).'
  },
  {
    id: 'nod',
    name: 'Ținutul Nod',
    biblicalName: 'אֶרֶץ נוֹד (Eretz Nod)',
    hebrewName: 'Nod (Pribegie, rătăcire)',
    type: 'region',
    coordinates: { x: 74.0, y: 59.0 },
    satelliteCoordinates: { x: 64.03, y: 31.39 }, // East of Mesopotamia towards Zagros / Iran
    regionalCoordinates: { x: 61.0, y: 44.5 },
    associatedPersonIds: ['cain'],
    period: 'Epoca Antediluviană (AM 100+)',
    description: 'Teritoriul aflat „la răsărit de Eden” în care Cain s-a retras ca pribeag și rătăcitor după condamnarea pentru uciderea lui Abel.',
    biblicalReference: 'Geneza 4:16',
    significance: 'Locul de pribegie al liniei cainite și al primei dezvoltări tehnologice și urbane a omenirii.',
    archaeologicalNotes: 'Localizat ipotetic în podișul iranian de la răsăritul munților Zagros sau văile adiacente Elamului antic.'
  },
  {
    id: 'enoch_city',
    name: 'Cetatea Enoh',
    biblicalName: 'עִיר חֲנוֹךְ (Ir Chanoch)',
    hebrewName: 'Chanoch (Inițiere, dedicare)',
    type: 'city',
    coordinates: { x: 73.0, y: 56.5 },
    satelliteCoordinates: { x: 63.83, y: 31.11 },
    regionalCoordinates: { x: 59.6, y: 43.0 },
    associatedPersonIds: ['cain'],
    period: 'Epoca Antediluviană (AM 120+)',
    description: 'Prima așezare fortificată zidită de mâna omului, fondată de Cain și denumită după numele fiului său Enoh.',
    biblicalReference: 'Geneza 4:17',
    significance: 'Simbolizează începutul urbanizării, organizării meșteșugărești și independenței umane timpurii.',
    archaeologicalNotes: 'Asociată de asiriologi cu siturile protourbane pre-dinastice din zona orientală sau cu primele cetăți sumeriene timpurii.'
  },
  {
    id: 'mesopotamia',
    name: 'Câmpia Șinear & Mesopotamia',
    biblicalName: 'אֶרֶץ שִׁנְעָר (Eretz Shinar)',
    hebrewName: 'Aram-Naharayim (Țara dintre două râuri)',
    type: 'region',
    coordinates: { x: 53.0, y: 50.0 },
    satelliteCoordinates: { x: 62.33, y: 31.94 }, // Fertile crescent plain between rivers
    regionalCoordinates: { x: 48.8, y: 47.5 },
    associatedPersonIds: ['set'],
    period: 'Epoca Patriarhilor (AM 130 - 1000)',
    description: 'Vasta câmpie aluvială dintre Tigru și Eufrat unde a înflorit linia setită și unde s-a păstrat invocarea Numelui Domnului.',
    biblicalReference: 'Geneza 4:26, 11:2',
    significance: 'Teritoriul de dezvoltare al descendenților lui Set, păstrători ai pietății și cunoașterii astronomice sacre.',
    archaeologicalNotes: 'Leagănul civilizației mesopotamiene (Ubaid, Uruk, Ur), caracterizat prin irigații avansate și agricultură cerealieră.'
  },
  {
    id: 'ararat',
    name: 'Munții Ararat',
    biblicalName: 'הָרֵי אֲרָרָט (Harei Ararat)',
    hebrewName: 'Urartu (Ținut înalt)',
    type: 'mountain',
    coordinates: { x: 47.5, y: 25.0 },
    satelliteCoordinates: { x: 62.30, y: 27.94 }, // Mount Ararat (Agri Dagi 39.7N, 44.3E)
    regionalCoordinates: { x: 48.6, y: 25.9 },
    associatedPersonIds: [],
    period: 'Perioada Potopului (AM 1656)',
    description: 'Lanțul muntos din nordul Orientului Apropiat pe care s-a oprit corabia lui Noe după retragerea apelor Marelui Potop.',
    biblicalReference: 'Geneza 8:4',
    significance: 'Punctul de repornire al speciei umane după judecata universală prin potop.',
    archaeologicalNotes: 'Regiunea regatului antic Urartu din podișul armean, dominată de vârful vulcanic Ararat (5.137 m).'
  },
  {
    id: 'havilah',
    name: 'Țara Havila',
    biblicalName: 'אֶרֶץ הַחֲוִילָה (Eretz HaChavilah)',
    hebrewName: 'Havilah (Ținutul nisipos)',
    type: 'region',
    coordinates: { x: 53.0, y: 76.0 },
    satelliteCoordinates: { x: 62.50, y: 35.28 }, // Northern Arabian desert peninsula
    regionalCoordinates: { x: 50.0, y: 65.5 },
    associatedPersonIds: ['adam'],
    period: 'Epoca Creației',
    description: 'Țara înconjurată de râul Pison, faimoasă în textul biblic pentru aurul ei cel bun, pentru bedelion și piatra de onix.',
    biblicalReference: 'Geneza 2:11-12',
    significance: 'Mărturie a bogăției minerale a pământului primar menționat în Geneza.',
    archaeologicalNotes: 'Identificată frecvent cu vestul sau nordul peninsulei Arabice (Wadi al-Batin / Mahd adh Dhahab).'
  },
  {
    id: 'hebron',
    name: 'Câmpia Mamre & Peștera Macpela (Hebron)',
    biblicalName: 'חֶבְרוֹן (Chevron) / מַכְפֵּלָה',
    hebrewName: 'Chevron (Uniune, legătură)',
    type: 'city',
    coordinates: { x: 28.5, y: 67.5 },
    satelliteCoordinates: { x: 59.75, y: 32.50 }, // Judean hill country / Canaan
    regionalCoordinates: { x: 30.2, y: 50.5 },
    associatedPersonIds: ['adam', 'eva'],
    period: 'Tradiție Istorică & Patriarhală',
    description: 'Conform tradițiilor talmudice și patristice timpurii, Adam și Eva ar fi fost îngropați în peștera Macpela (Mormântul celor patru perechi: Adam și Eva, Avraam și Sara, Isaac și Rebeca, Iacov și Lea).',
    biblicalReference: 'Geneza 23:19; Tradiția Talmudică (Eruvin 53a)',
    significance: 'Loc venerat timp de milenii ca loc de odihnă al patriarhilor.',
    archaeologicalNotes: 'Una dintre cele mai vechi așezări locuite continuu din Orientul Apropiat, cu zidiri herodiene masive.'
  }
];

export const MIGRATION_PATHS: MigrationPath[] = [
  {
    id: 'mig-eden-expulsion',
    title: 'Izgonirea din Grădina Edenului',
    personId: 'adam',
    startLocationId: 'eden',
    endLocationId: 'mesopotamia',
    startCoord: { x: 58.5, y: 64.0 },
    endCoord: { x: 53.0, y: 55.0 },
    controlPoint: { x: 57.0, y: 59.0 },
    satelliteStartCoord: { x: 63.17, y: 32.78 },
    satelliteEndCoord: { x: 62.33, y: 31.94 },
    satelliteControlPoint: { x: 62.8, y: 32.2 },
    regionalStartCoord: { x: 54.8, y: 52.0 },
    regionalEndCoord: { x: 48.8, y: 47.5 },
    regionalControlPoint: { x: 52.0, y: 49.0 },
    period: 'Epoca Căderii (AM 1)',
    biblicalReference: 'Geneza 3:23-24',
    description: 'Adam și Eva au fost scoși din Grădină și au început să lucreze pământul la hotarele răsăritene ale Edenului, străjuiți de heruvimi cu săbii de flăcări.',
    color: '#d97706'
  },
  {
    id: 'mig-cain-to-nod',
    title: 'Fuga și pribegia lui Cain spre Ținutul Nod',
    personId: 'cain',
    startLocationId: 'eden',
    endLocationId: 'nod',
    startCoord: { x: 58.5, y: 64.0 },
    endCoord: { x: 74.0, y: 59.0 },
    controlPoint: { x: 67.0, y: 65.0 },
    satelliteStartCoord: { x: 63.17, y: 32.78 },
    satelliteEndCoord: { x: 64.03, y: 31.39 },
    satelliteControlPoint: { x: 63.7, y: 32.4 },
    regionalStartCoord: { x: 54.8, y: 52.0 },
    regionalEndCoord: { x: 61.0, y: 44.5 },
    regionalControlPoint: { x: 58.5, y: 49.0 },
    period: 'Epoca Antediluviană (AM 100+)',
    biblicalReference: 'Geneza 4:16',
    description: 'Cain s-a îndepărtat definitiv de prezența divină și a peregrinat la răsărit, traversând văile spre podișurile din Nod.',
    color: '#dc2626'
  },
  {
    id: 'mig-cain-to-city',
    title: 'Întemeierea Cetății Enoh',
    personId: 'cain',
    startLocationId: 'nod',
    endLocationId: 'enoch_city',
    startCoord: { x: 74.0, y: 59.0 },
    endCoord: { x: 73.0, y: 56.5 },
    controlPoint: { x: 74.0, y: 57.5 },
    satelliteStartCoord: { x: 64.03, y: 31.39 },
    satelliteEndCoord: { x: 63.83, y: 31.11 },
    satelliteControlPoint: { x: 63.95, y: 31.25 },
    regionalStartCoord: { x: 61.0, y: 44.5 },
    regionalEndCoord: { x: 59.6, y: 43.0 },
    regionalControlPoint: { x: 60.5, y: 43.8 },
    period: 'Epoca Antediluviană (AM 120+)',
    biblicalReference: 'Geneza 4:17',
    description: 'Cain renunță la nomadismul rătăcitor și zidește prima așezare fortificată urbană cunoscută din textul biblic.',
    color: '#b91c1c'
  },
  {
    id: 'mig-set-expansion',
    title: 'Așezarea și proliferarea liniei lui Set',
    personId: 'set',
    startLocationId: 'eden',
    endLocationId: 'mesopotamia',
    startCoord: { x: 57.0, y: 62.0 },
    endCoord: { x: 50.0, y: 47.0 },
    controlPoint: { x: 52.0, y: 54.0 },
    satelliteStartCoord: { x: 63.0, y: 32.6 },
    satelliteEndCoord: { x: 62.1, y: 31.6 },
    satelliteControlPoint: { x: 62.5, y: 32.0 },
    regionalStartCoord: { x: 54.0, y: 51.0 },
    regionalEndCoord: { x: 47.5, y: 46.0 },
    regionalControlPoint: { x: 50.5, y: 48.0 },
    period: 'Generațiile lui Set (AM 130 - 1000)',
    biblicalReference: 'Geneza 4:26, 5:3-32',
    description: 'Linia descendenților lui Set s-a răspândit pașnic de-a lungul cursurilor superioare ale Eufratului și Tigrului, chemând Numele Domnului.',
    color: '#2563eb'
  }
];

export const TERRITORY_AREAS: TerritoryArea[] = [
  {
    id: 'terr-eden',
    name: 'Regiunea Edenului Primordial',
    biblicalName: 'Gan Eden & Confluența Fluvială',
    period: 'Creație (AM 0 - 130)',
    path: 'M 540 330 C 590 320, 640 340, 630 380 C 620 420, 560 410, 530 380 Z',
    satellitePath: 'M 1250 320 C 1270 315, 1280 325, 1275 340 C 1265 350, 1245 345, 1240 330 Z',
    regionalPath: 'M 1600 1000 C 1680 980, 1720 1030, 1700 1100 C 1660 1140, 1580 1120, 1560 1050 Z',
    hatchPattern: 'diagonal',
    color: '#15803d',
    description: 'Bazinul primordial unde se intersectau cele patru mari cursuri de apă sacre din Geneza 2.',
    biblicalReference: 'Geneza 2:8-14'
  },
  {
    id: 'terr-nod',
    name: 'Ținutul Rătăcirii (Nod)',
    biblicalName: 'Eretz Nod',
    period: 'Antediluvian (AM 100 - 1656)',
    path: 'M 690 290 C 740 280, 800 310, 790 370 C 770 410, 710 390, 680 340 Z',
    satellitePath: 'M 1270 300 C 1290 295, 1310 305, 1305 325 C 1295 335, 1275 330, 1268 315 Z',
    regionalPath: 'M 1780 840 C 1870 820, 1950 860, 1930 940 C 1890 980, 1800 960, 1770 900 Z',
    hatchPattern: 'cross',
    color: '#b91c1c',
    description: 'Pământul la răsărit de Eden unde s-au dezvoltat cetatea Enoh și meșteșugurile fierului și bronzului (Tubal-Cain).',
    biblicalReference: 'Geneza 4:16-22'
  },
  {
    id: 'terr-mesopotamia',
    name: 'Câmpia Șinear & Fertilitatea Mesopotamiană',
    biblicalName: 'Valea Tigru - Eufrat',
    period: 'Toate Perioadele',
    path: 'M 430 220 C 510 240, 590 300, 550 370 C 490 340, 440 270, 420 230 Z',
    satellitePath: 'M 1230 305 C 1260 310, 1270 330, 1255 345 C 1235 340, 1220 325, 1225 310 Z',
    regionalPath: 'M 1420 900 C 1530 920, 1580 1020, 1510 1080 C 1440 1060, 1370 980, 1390 920 Z',
    hatchPattern: 'dots',
    color: '#d97706',
    description: 'Coridorul fertil dintre cele două mari fluvii, căminul patriarhilor din linia lui Set.',
    biblicalReference: 'Geneza 5:1-32'
  }
];

export const HISTORICAL_PERIODS = [
  { id: 'all', label: 'Toate Perioadele', rangeAM: 'AM 0 - 1656' },
  { id: 'creation', label: 'Creația & Eden', rangeAM: 'AM 0 - 1' },
  { id: 'first_sons', label: 'Cain, Abel & Pribegia', rangeAM: 'AM 2 - 130' },
  { id: 'set_line', label: 'Linia lui Set & Patriarhii', rangeAM: 'AM 130 - 1000' },
  { id: 'antediluvian', label: 'Generațiile Antediluviene', rangeAM: 'AM 1000 - 1656' }
];
