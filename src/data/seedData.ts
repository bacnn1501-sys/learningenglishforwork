import {
  Track,
  Unit,
  Lesson,
  VocabularyItem,
  ExerciseItem,
  PhraseCategory,
  CultureNoteItem,
  PlacementQuestion
} from '../types';
import { generateSearchKeywords } from '../utils/text';

// ==========================================
// 1. TRACKS
// ==========================================
export const seedTracks: Track[] = [
  {
    id: 'waiter',
    nameEn: 'Waiter & Waitress',
    nameVi: 'Nhân viên Phục vụ Bàn',
    descriptionEn: 'Master dining room communication, welcoming, taking orders, wine pairing, and complaint resolution.',
    descriptionVi: 'Giao tiếp phòng ăn, chào đón khách, tư vấn món, phục vụ đồ uống và xử lý tình huống phàn nàn.',
    icon: 'UtensilsCrossed',
    color: '#B93815',
    order: 1,
    status: 'published'
  },
  {
    id: 'bartender',
    nameEn: 'Bartender & Mixologist',
    nameVi: 'Pha chế Quầy Bar (Rượu & Cocktail)',
    descriptionEn: 'Spirits, glassware, cocktail craftsmanship, flavor profiles, and engaging bar guest conversations.',
    descriptionVi: 'Thuật ngữ rượu mạnh, ly tách, kỹ thuật pha cocktail, mô tả hương vị và giao tiếp tại quầy bar.',
    icon: 'Wine',
    color: '#9B2C0E',
    order: 2,
    status: 'published'
  },
  {
    id: 'barista',
    nameEn: 'Barista & Cafe Specialist',
    nameVi: 'Barista & Chuyên viên Cà phê',
    descriptionEn: 'Coffee origin, roasting notes, milk steaming, brewing ratios, and handling custom beverage orders.',
    descriptionVi: 'Nguồn gốc cà phê, ghi chú hương vị, đánh sữa, tỉ lệ chiết xuất và tùy biến đồ uống theo ý khách.',
    icon: 'Coffee',
    color: '#81270F',
    order: 3,
    status: 'published'
  },
  {
    id: 'kitchen',
    nameEn: 'Kitchen & Culinary Team',
    nameVi: 'Đầu bếp & Phụ bếp',
    descriptionEn: 'Culinary prep, line communication, food safety (HACCP), allergens, and plating terms.',
    descriptionVi: 'Giao tiếp trong bếp, lệnh gọi món, an toàn thực phẩm, xử lý dị ứng và thuật ngữ nấu ăn quốc tế.',
    icon: 'ChefHat',
    color: '#4D6B53',
    order: 4,
    status: 'published'
  },
  {
    id: 'reception',
    nameEn: 'Host & Restaurant Reception',
    nameVi: 'Lễ tân & Đón tiếp Nhà hàng',
    descriptionEn: 'Telephone etiquette, table reservations, VIP greeting, waitlist management, and farewells.',
    descriptionVi: 'Nghi thức trực điện thoại, đặt bàn trước, đón tiếp khách VIP, điều phối hàng chờ và chào tạm biệt.',
    icon: 'Sparkles',
    color: '#D45D44',
    order: 5,
    status: 'published'
  },
  {
    id: 'general',
    nameEn: 'F&B Management & Interview',
    nameVi: 'F&B Tổng quát & Phỏng vấn Xin việc',
    descriptionEn: 'Shift handovers, inventory, hygiene audits, guest service standards, and job interview mastery.',
    descriptionVi: 'Bàn giao ca, kiểm kê kho, kiểm tra vệ sinh, tiêu chuẩn dịch vụ và phỏng vấn ứng tuyển ngành F&B.',
    icon: 'Award',
    color: '#2B1C19',
    order: 6,
    status: 'published'
  }
];

// ==========================================
// 2. UNITS
// ==========================================
export const seedUnits: Unit[] = [
  // Waiter Track Units
  {
    id: 'waiter-u1',
    trackId: 'waiter',
    level: 'A1',
    titleEn: 'Greeting & Seating Guests',
    titleVi: 'Chào đón & Dẫn khách vào bàn',
    descriptionEn: 'Polite greetings, table preference questions, escorting guests, and presenting menus.',
    descriptionVi: 'Chào hỏi lịch thiệp, hỏi số lượng và sở thích chỗ ngồi, dẫn khách và trao thực đơn chuyên nghiệp.',
    order: 1,
    status: 'published',
    icon: 'DoorOpen',
    requiredScore: 70
  },
  {
    id: 'waiter-u2',
    trackId: 'waiter',
    level: 'A1',
    titleEn: 'Taking Orders & Dietary Inquiries',
    titleVi: 'Ghi món & Kiểm tra Dị ứng / Ăn kiêng',
    descriptionEn: 'Note taking, clarifying cooking preferences (steaks, sides), allergy checks, and confirming orders.',
    descriptionVi: 'Ghi nhận món, hỏi độ chín món bò, lưu ý món phụ, hỏi kỹ dị ứng và nhắc lại xác nhận đơn gọi món.',
    order: 2,
    status: 'published',
    icon: 'ClipboardList',
    requiredScore: 70
  },
  {
    id: 'waiter-u3',
    trackId: 'waiter',
    level: 'A2',
    titleEn: 'Handling Delays & Guest Complaints',
    titleVi: 'Xử lý Món trễ & Giải quyết Phàn nàn',
    descriptionEn: 'Empathetic apologies, de-escalating unhappy diners, offering solutions, and compensatory gestures.',
    descriptionVi: 'Lời xin lỗi chân thành, lắng nghe thấu cảm, giải quyết vấn đề và đề xuất giải pháp làm hài lòng khách.',
    order: 3,
    status: 'published',
    icon: 'AlertTriangle',
    requiredScore: 70
  },
  {
    id: 'waiter-u4',
    trackId: 'waiter',
    level: 'A2',
    titleEn: 'Presenting the Bill & Parting Words',
    titleVi: 'Thanh toán Hóa đơn & Tiễn khách',
    descriptionEn: 'Splitting bills, payment methods, gratuity etiquette, and warm, memorable farewells.',
    descriptionVi: 'Tách bill theo yêu cầu, thanh toán thẻ/tiền mặt, quy tắc tiền tip và lời cảm ơn tiễn khách chu đáo.',
    order: 4,
    status: 'published',
    icon: 'CreditCard',
    requiredScore: 70
  },

  // Bartender Track Units
  {
    id: 'bartender-u1',
    trackId: 'bartender',
    level: 'A1',
    titleEn: 'Bar Tools, Glassware & Drink Styles',
    titleVi: 'Dụng cụ Quầy Bar, Ly tách & Kiểu Đồ uống',
    descriptionEn: 'Essential bartending tools, glassware names, ice types, and core cocktail preparation styles.',
    descriptionVi: 'Tên dụng cụ quầy bar, các dáng ly tiêu chuẩn, loại đá và phương pháp pha (shaken, stirred, built).',
    order: 1,
    status: 'published',
    icon: 'GlassWater',
    requiredScore: 70
  },
  {
    id: 'bartender-u2',
    trackId: 'bartender',
    level: 'A2',
    titleEn: 'Recommending Drinks & Flavor Profiles',
    titleVi: 'Tư vấn Thức uống & Mô tả Hương vị',
    descriptionEn: 'Describing sweet, sour, bitter, smoky, and herbaceous cocktails to find the perfect match.',
    descriptionVi: 'Mô tả hương vị (ngọt, chua, đắng, khói, thảo mộc) và gợi ý thức uống phù hợp với sở thích của khách.',
    order: 2,
    status: 'published',
    icon: 'Sparkles',
    requiredScore: 70
  },

  // Barista Track Units
  {
    id: 'barista-u1',
    trackId: 'barista',
    level: 'A1',
    titleEn: 'The Espresso Menu & Milk Variations',
    titleVi: 'Thực đơn Espresso & Các loại Sữa',
    descriptionEn: 'Explaining espresso, americano, flat white, latte, and plant-based milk alternatives (oat, almond, soy).',
    descriptionVi: 'Giải thích menu cà phê Ý, tỷ lệ sữa, và các dòng sữa hạt thay thế dành cho khách ăn chay/dị ứng lactose.',
    order: 1,
    status: 'published',
    icon: 'Coffee',
    requiredScore: 70
  },
  {
    id: 'barista-u2',
    trackId: 'barista',
    level: 'A2',
    titleEn: 'Dial-in, Tasting Notes & Custom Orders',
    titleVi: 'Chiết xuất, Ghi chú Hương vị & Tùy biến Món',
    descriptionEn: 'Single origin vs blend, temperature, sweetness levels, decaf, and to-go cup sizing.',
    descriptionVi: 'Cà phê nguyên bản và phối trộn, mức độ ngọt/đá, cà phê khử caffein (decaf) và kích cỡ ly mang đi.',
    order: 2,
    status: 'published',
    icon: 'Sliders',
    requiredScore: 70
  },

  // Reception Track Units
  {
    id: 'reception-u1',
    trackId: 'reception',
    level: 'A1',
    titleEn: 'Telephone Reservations & Walk-ins',
    titleVi: 'Đặt bàn qua Điện thoại & Khách vãng lai',
    descriptionEn: 'Taking guest details, confirming time and party size, handling fully-booked situations gracefully.',
    descriptionVi: 'Tiếp nhận thông tin khách, xác nhận thời gian, số khách và từ chối khéo léo khi nhà hàng đã kín bàn.',
    order: 1,
    status: 'published',
    icon: 'PhoneCall',
    requiredScore: 70
  }
];

// ==========================================
// 3. LESSONS
// ==========================================
export const seedLessons: Lesson[] = [
  // Waiter U1 Lessons
  {
    id: 'waiter-u1-l1',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    titleEn: 'Warm Hospitality & Table Inquiries',
    titleVi: 'Chào hỏi Thân thiện & Xác nhận Bàn',
    type: 'vocabulary',
    order: 1,
    status: 'published',
    xpReward: 30,
    contentSummary: 'Học các từ vựng và cụm từ cốt lõi khi khách vừa bước vào cửa nhà hàng.'
  },
  {
    id: 'waiter-u1-l2',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    titleEn: 'Table Seating & Menu Handover Dialogue',
    titleVi: 'Dẫn Bàn & Trao Thực đơn (Hội thoại)',
    type: 'dialogue',
    order: 2,
    status: 'published',
    xpReward: 35,
    dialogue: [
      {
        speaker: 'staff',
        textEn: 'Good evening! Welcome to The Olive Branch. Do you have a reservation with us tonight?',
        textVi: 'Kính chào quý khách! Chào mừng quý khách đến với The Olive Branch. Quý khách đã đặt bàn trước chưa ạ?'
      },
      {
        speaker: 'guest',
        textEn: 'Good evening. No, we don\'t have a booking. Is there a table available for two?',
        textVi: 'Chào bạn. Chúng tôi chưa đặt trước. Liệu có bàn trống cho 2 người không?'
      },
      {
        speaker: 'staff',
        textEn: 'Certainly! Would you prefer indoor seating with air conditioning or a table on our garden terrace?',
        textVi: 'Dạ có chứ ạ! Quý khách thích ngồi trong nhà có máy lạnh hay bàn ngoài sân vườn ngắm cảnh ạ?'
      },
      {
        speaker: 'guest',
        textEn: 'A terrace table would be lovely, please.',
        textVi: 'Cho chúng tôi bàn ngoài sân vườn nhé.'
      },
      {
        speaker: 'staff',
        textEn: 'Right this way, please. Here are your food and wine menus. My name is Linh, and I will be taking care of you tonight. Can I start you off with some still or sparkling water?',
        textVi: 'Dạ mời quý khách đi lối này ạ. Đây là thực đơn món và rượu vang. Em tên Linh, phụ trách bàn của quý khách tối nay. Quý khách muốn dùng nước suối thường hay nước có ga trước ạ?'
      }
    ]
  },
  {
    id: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    titleEn: 'Practice: Greeting & Escorting Scenarios',
    titleVi: 'Luyện tập: Chào đón & Hướng dẫn Khách',
    type: 'exercise',
    order: 3,
    status: 'published',
    xpReward: 40
  },
  {
    id: 'waiter-u1-l4',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    titleEn: 'Role-play: The Walk-in Couple',
    titleVi: 'Đóng vai Tương tác: Cặp đôi Vãng lai',
    type: 'roleplay',
    order: 4,
    status: 'published',
    xpReward: 50
  },

  // Waiter U2 Lessons
  {
    id: 'waiter-u2-l1',
    unitId: 'waiter-u2',
    trackId: 'waiter',
    titleEn: 'Essential Order Taking Vocabulary',
    titleVi: 'Từ vựng Trọng tâm khi Ghi món',
    type: 'vocabulary',
    order: 1,
    status: 'published',
    xpReward: 30
  },
  {
    id: 'waiter-u2-l2',
    unitId: 'waiter-u2',
    trackId: 'waiter',
    titleEn: 'Steak Doneness & Allergen Checks',
    titleVi: 'Độ chín Món Bò & Dị ứng Thực phẩm',
    type: 'exercise',
    order: 2,
    status: 'published',
    xpReward: 40
  },

  // Waiter U3 Lessons
  {
    id: 'waiter-u3-l1',
    unitId: 'waiter-u3',
    trackId: 'waiter',
    titleEn: 'The L.A.S.T Method for Complaints',
    titleVi: 'Phương pháp L.A.S.T Xử lý Phàn nàn',
    type: 'dialogue',
    order: 1,
    status: 'published',
    xpReward: 40,
    dialogue: [
      {
        speaker: 'guest',
        textEn: 'Excuse me! We have been waiting for our main courses for over 40 minutes now!',
        textVi: 'Nhân viên ơi! Chúng tôi đã đợi món chính hơn 40 phút rồi đấy!'
      },
      {
        speaker: 'staff',
        textEn: 'I sincerely apologize for the delay, sir. Let me check with the head chef right away.',
        textVi: 'Dạ em thành thật xin lỗi quý khách về sự chậm trễ này. Em xin phép vào báo bếp trưởng kiểm tra ngay lập tức ạ.'
      },
      {
        speaker: 'staff',
        textEn: 'Thank you for your patience. Your steaks are on the pass and will be served in just two minutes. Please accept these complimentary glasses of prosecco with our compliments.',
        textVi: 'Cảm ơn quý khách đã kiên nhẫn. Món bò của anh chị đang được ra đĩa và sẽ dọn lên trong 2 phút tới ạ. Nhà hàng xin phép kính mời anh chị hai ly vang sủi này như lời tạ lỗi ạ.'
      }
    ]
  },

  // Bartender U1 Lessons
  {
    id: 'bartender-u1-l1',
    unitId: 'bartender-u1',
    trackId: 'bartender',
    titleEn: 'Bar Tools, Ice & Glassware Terminology',
    titleVi: 'Dụng cụ Bar, Các dạng Đá & Dáng Ly',
    type: 'vocabulary',
    order: 1,
    status: 'published',
    xpReward: 30
  },
  {
    id: 'bartender-u1-l2',
    unitId: 'bartender-u1',
    trackId: 'bartender',
    titleEn: 'Cocktail Preparation Verbs & Techniques',
    titleVi: 'Động từ Kỹ thuật Pha chế Quầy Bar',
    type: 'exercise',
    order: 2,
    status: 'published',
    xpReward: 35
  },

  // Barista U1 Lessons
  {
    id: 'barista-u1-l1',
    unitId: 'barista-u1',
    trackId: 'barista',
    titleEn: 'Espresso Anatomy & Coffee Varieties',
    titleVi: 'Cấu tạo Ly Espresso & Các loại Cà phê',
    type: 'vocabulary',
    order: 1,
    status: 'published',
    xpReward: 30
  },
  {
    id: 'barista-u1-l2',
    unitId: 'barista-u1',
    trackId: 'barista',
    titleEn: 'Customizing Milk, Syrups & Temperature',
    titleVi: 'Tùy biến Sữa, Xi-rô & Nhiệt độ Đồ uống',
    type: 'dialogue',
    order: 2,
    status: 'published',
    xpReward: 35
  }
];

// Helper to build vocabulary item with auto keywords
function createVocab(
  id: string,
  term: string,
  ipa: string,
  partOfSpeech: any,
  meaningVi: string,
  definitionEn: string,
  exampleEn: string,
  exampleVi: string,
  collocations: string[],
  synonymsOrConfusedWith: string[],
  culturalNotes: string,
  tags: string[],
  level: any,
  track: string,
  imageUrl?: string
): VocabularyItem {
  return {
    id,
    term,
    ipa,
    partOfSpeech,
    meaningVi,
    definitionEn,
    exampleEn,
    exampleVi,
    collocations,
    synonymsOrConfusedWith,
    culturalNotes,
    tags,
    level,
    track,
    imageUrl,
    status: 'published',
    createdAt: Date.now() - Math.floor(Math.random() * 10000000),
    updatedAt: Date.now(),
    termLower: term.toLowerCase(),
    searchKeywords: generateSearchKeywords(term, [meaningVi, ...tags, track, level, ...collocations])
  };
}

// ==========================================
// 4. VOCABULARY (100+ REALISTIC F&B ITEMS)
// ==========================================
export const seedVocabulary: VocabularyItem[] = [
  // --- WAITER / DINING ROOM VOCABULARY ---
  createVocab(
    'v-reservation',
    'Reservation',
    '/ˌrez.ɚˈveɪ.ʃən/',
    'noun',
    'Đặt bàn trước (chỗ ngồi giữ trước)',
    'An arrangement to have a table kept for a guest at a specific time.',
    'Do you have a reservation under the name Mr. Smith tonight?',
    'Dạ anh có đặt bàn trước dưới tên ông Smith tối nay không ạ?',
    ['make a reservation', 'have a reservation under', 'cancel a reservation'],
    ['booking', 'appointment (dùng cho bác sĩ/công việc, không dùng cho nhà hàng)'],
    'Phương Tây coi trọng việc đặt bàn trước, đặc biệt vào tối thứ 6 và thứ 7.',
    ['dining', 'greeting', 'basics'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-walkin',
    'Walk-in guest',
    '/ˈwɑːk.ɪn ɡest/',
    'noun',
    'Khách vãng lai (không đặt trước)',
    'A diner who arrives at a restaurant without a prior reservation.',
    'We keep a few high-top tables reserved for walk-in guests at the front.',
    'Chúng tôi giữ lại vài bàn cao phía trước dành cho khách vãng lai.',
    ['welcome walk-ins', 'accommodate walk-ins', 'walk-in party'],
    ['spontaneous guest'],
    'Khi nhà hàng kín bàn, nên nói lịch sự: "We are fully booked right now, but I can check the waitlist for you."',
    ['front-of-house', 'greeting'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-party',
    'Party',
    '/ˈpɑːr.t̬i/',
    'noun',
    'Nhóm khách / số lượng người đi cùng',
    'A group of people dining together in a restaurant context.',
    'How many guests are in your party this evening, ma\'am?',
    'Dạ thưa chị, nhóm của mình tối nay đi bao nhiêu người ạ?',
    ['party of two/four', 'large party', 'party size'],
    ['group', 'table (dùng Party of [number] là chuẩn lễ tân nhất)'],
    'Cách hỏi chuẩn nhà hàng cao cấp là "How many in your party?", tránh hỏi cộc lốc "How many people?".',
    ['greeting', 'etiquette'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-terrace',
    'Terrace',
    '/ˈter.əs/',
    'noun',
    'Khu vực ngoài trời / ban công / sân hiên',
    'An outdoor flat paved area outside a restaurant used for dining.',
    'Would you prefer dining inside with air-conditioning or outside on the terrace?',
    'Quý khách thích ngồi bên trong có điều hòa hay ngoài sân hiên thoáng mát ạ?',
    ['patio seating', 'terrace view', 'outdoor terrace'],
    ['patio', 'balcony', 'alfresco dining'],
    'Khách Tây rất chuộng "alfresco dining" (ngồi ngoài trời) vào mùa xuân hoặc chiều tà mát mẻ.',
    ['seating', 'atmosphere'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-complimentary',
    'Complimentary',
    '/ˌkɑːm.pləˈmen.t̬ɚ.i/',
    'adj',
    'Miễn phí (do nhà hàng kính mời/tặng)',
    'Given free as a courtesy or favor by the establishment.',
    'Please enjoy this complimentary dessert on the house for your wedding anniversary.',
    'Kính mời anh chị dùng món tráng miệng miễn phí này nhân kỷ niệm ngày cưới ạ.',
    ['complimentary drink', 'complimentary bread basket', 'on the house'],
    ['free (dùng complimentary nghe lịch sự và sang trọng hơn nhiều)', 'gifted'],
    'Nên dùng từ "complimentary" hoặc cụm "on the house" thay vì dùng từ "free" trong giao tiếp F&B.',
    ['service', 'hospitality'],
    'A2',
    'waiter'
  ),
  createVocab(
    'v-appetizer',
    'Appetizer / Starter',
    '/ˈæp.ə.taɪ.zɚ/',
    'noun',
    'Món khai vị',
    'A small dish of food served before the main course to stimulate appetite.',
    'Can I start you off with a warm bread basket or an appetizer while you browse?',
    'Em có thể xin phép dọn giỏ bánh mì nóng hoặc món khai vị trước cho quý khách không ạ?',
    ['order appetizers', 'cold appetizer', 'sharing starter'],
    ['starter (chuẩn Anh - Anh)', 'hors d\'oeuvre (tiếng Pháp trang trọng)'],
    'Ở Mỹ thường dùng Appetizer, còn ở Anh - Úc hay dùng Starter.',
    ['menu', 'courses'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-entree',
    'Entrée / Main course',
    '/ˈɑːn.treɪ/',
    'noun',
    'Món chính (Bắc Mỹ dùng Entrée, Anh dùng Main course)',
    'The principal and largest dish served during a formal meal.',
    'For your main course, may I recommend our slow-roasted herb lamb shank?',
    'Về món chính, em xin phép giới thiệu món bắp cừu hầm thảo mộc hảo hạng ạ.',
    ['main course', 'fish entrée', 'signature main'],
    ['main dish', 'plat principal'],
    'Lưu ý: Tại Mỹ, "Entrée" là Món Chính, nhưng ở Pháp và Anh, "Entrée" lại có nghĩa là món khai vị!',
    ['menu', 'courses'],
    'A2',
    'waiter'
  ),
  createVocab(
    'v-rare',
    'Rare / Medium-rare',
    '/ˌmiː.di.əm ˈrer/',
    'adj',
    'Độ chín tái / tái vừa (dành cho bít tết)',
    'Cooked so that the meat remains predominantly pink and juicy in the center.',
    'How would you like your ribeye steak cooked tonight, sir? Medium-rare?',
    'Dạ thưa anh, anh muốn làm miếng bò ribeye chín mức nào ạ? Tái vừa phải không ạ?',
    ['medium-rare steak', 'rare to medium', 'chef recommends medium-rare'],
    ['rare', 'medium', 'medium-well', 'well-done'],
    'Thứ tự độ chín chuẩn: Blue rare -> Rare -> Medium rare (ngon nhất) -> Medium -> Medium well -> Well done.',
    ['kitchen', 'cooking', 'meat'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-allergen',
    'Allergen',
    '/ˈæl.ɚ.dʒən/',
    'noun',
    'Chất gây dị ứng (trong thực phẩm)',
    'A substance that can cause an adverse allergic medical reaction.',
    'Does anyone at the table have any food allergies or dietary restrictions?',
    'Dạ trong bàn mình có ai bị dị ứng thức ăn hay có chế độ kiêng khem gì không ạ?',
    ['food allergen', 'allergic to shellfish', 'peanut allergy'],
    ['sensitivity', 'intolerance'],
    'Cực kỳ quan trọng: Luôn hỏi dị ứng trước khi chốt món để tránh sốc phản vệ cho khách quốc tế.',
    ['safety', 'health', 'allergens'],
    'A2',
    'waiter'
  ),
  createVocab(
    'v-glutenfree',
    'Gluten-free',
    '/ˌɡluː.tən ˈfriː/',
    'adj',
    'Không chứa gluten (lúa mì/mạch)',
    'Food containing no gluten protein, essential for diners with Celiac disease.',
    'We offer gluten-free pasta and bread upon request at no extra charge.',
    'Nhà hàng có mì pasta và bánh mì không chứa gluten theo yêu cầu miễn phí thêm ạ.',
    ['gluten-free option', 'celiac safe', 'gluten intolerance'],
    ['wheat-free'],
    'Dành cho khách mắc bệnh Celiac (không tiêu hóa được lúa mì, lúa mạch).',
    ['dietary', 'health'],
    'A2',
    'waiter'
  ),
  createVocab(
    'v-spill',
    'Spill',
    '/spɪl/',
    'verb / noun',
    'Làm đổ / sự cố tràn nước ra bàn',
    'To cause liquid to flow over the edge of a container by accident.',
    'I am so sorry! Let me wipe that spill immediately and bring you fresh napkins.',
    'Em vô cùng xin lỗi! Để em lau sạch chỗ nước đổ ngay và mang khăn ăn mới cho quý khách ạ.',
    ['spill wine', 'clean up a spill', 'accidental spill'],
    ['overflow', 'leak'],
    'Khi lỡ làm đổ nước/rượu: xin lỗi ngay, lấy khăn sạch dọn trong yên lặng và đổi đồ uống mới.',
    ['service', 'mishap'],
    'A2',
    'waiter'
  ),
  createVocab(
    'v-decaf',
    'Decaf / Decaffeinated',
    '/ˈdiː.kæf/',
    'adj / noun',
    'Cà phê đã khử caffeine',
    'Coffee from which most or all of the stimulating caffeine has been removed.',
    'Would you prefer regular espresso or decaf after your dessert?',
    'Dạ sau món tráng miệng, anh chị muốn dùng espresso thường hay loại decaf khử cafein ạ?',
    ['decaf coffee', 'decaf latte', 'switch to decaf'],
    ['caffeine-free'],
    'Khách phương Tây sau 5 giờ chiều rất hay gọi decaf để không bị mất ngủ.',
    ['beverage', 'coffee'],
    'A1',
    'barista'
  ),
  createVocab(
    'v-bill',
    'Bill / Check',
    '/bɪl/ /tʃek/',
    'noun',
    'Hóa đơn thanh toán (Bill: Anh/Úc, Check: Mỹ)',
    'A printed statement showing the charges for food and drinks consumed.',
    'Could we have the bill, please? Certainly, I will bring it right away.',
    'Cho chúng tôi xin hóa đơn nhé? Dạ vâng, em mang tới ngay cho quý khách ạ.',
    ['ask for the bill', 'split the check', 'settle the bill'],
    ['receipt (biên lai sau khi đã trả tiền)', 'invoice (hóa đơn VAT)'],
    'Nên đặt hóa đơn trong bìa da úp mặt số lại, không nhìn chăm chú lúc khách ký thẻ.',
    ['payment', 'front-of-house'],
    'A1',
    'waiter'
  ),
  createVocab(
    'v-split',
    'Split the bill',
    '/splɪt ðə bɪl/',
    'phrase',
    'Chia tiền hóa đơn / Tách bill',
    'To divide the total dining cost equally or by individual orders among guests.',
    'Would you like to pay together or split the bill between the two cards?',
    'Dạ quý khách muốn thanh toán chung hay chia đôi hóa đơn vào hai thẻ ạ?',
    ['split evenly', 'split itemized', 'pay separately'],
    ['go Dutch (thành ngữ thân mật)'],
    'Nhiều đoàn khách nước ngoài thường tách bill. Hãy hỏi trước: "Are you paying together or separately?"',
    ['payment', 'accounting'],
    'A2',
    'waiter'
  ),
  createVocab(
    'v-gratuity',
    'Gratuity / Tip',
    '/ɡrəˈtuː.ə.t̬i/',
    'noun',
    'Tiền boa / tiền tip thưởng thêm cho dịch vụ',
    'A tip given to a server or bartender in recognition of good service.',
    'Please note that a 10% service charge is already included in your final bill.',
    'Dạ xin lưu ý rằng phí dịch vụ 10% đã được bao gồm sẵn trong tổng hóa đơn của quý khách rồi ạ.',
    ['leave a gratuity', 'service charge included', 'tip generously'],
    ['tip', 'service charge'],
    'Ở Mỹ tip bắt buộc từ 15-22%. Ở châu Âu và Việt Nam phí dịch vụ thường được ghi rõ trong bill.',
    ['culture', 'payment'],
    'B1',
    'waiter'
  ),

  // --- BARTENDER & DRINKS VOCABULARY ---
  createVocab(
    'v-ontherocks',
    'On the rocks',
    '/ɑːn ðə rɑːks/',
    'phrase',
    'Uống kèm với đá viên (rượu mạnh)',
    'A spirit or cocktail served poured over ice cubes in a rocks glass.',
    'Would you like your single malt Scotch neat or on the rocks, sir?',
    'Dạ anh muốn dùng rượu Scotch nguyên chất không đá hay kèm đá viên ạ?',
    ['whiskey on the rocks', 'serve on the rocks', 'pour over rocks'],
    ['with ice', 'chilled over ice'],
    '"Neat" = nguyên chất ở nhiệt độ phòng; "On the rocks" = rót lên đá viên to.',
    ['bar', 'whiskey', 'spirits'],
    'A1',
    'bartender'
  ),
  createVocab(
    'v-neat',
    'Neat',
    '/niːt/',
    'adj / adv',
    'Uống nguyên chất (không đá, không pha nước)',
    'A single, unmixed spirit served without water, ice, or other mixers.',
    'He ordered a double Macallan 12 neat in a tulip glass.',
    'Anh ấy đã gọi một ly Macallan 12 đúp uống nguyên chất trong ly tulip.',
    ['serve neat', 'pour it neat', 'drink straight'],
    ['straight up (dễ nhầm: straight up nghĩa là lắc với đá rồi gạn bỏ đá vào ly)'],
    'Uống neat giúp giữ nguyên nhiệt độ và tầng hương thơm nguyên bản của rượu ủ thùng gỗ sồi.',
    ['bar', 'spirits'],
    'A2',
    'bartender'
  ),
  createVocab(
    'v-shaker',
    'Cocktail Shaker',
    '/ˈkɑːk.teɪl ˈʃeɪ.kɚ/',
    'noun',
    'Bình lắc cocktail',
    'A metal or glass vessel used to mix ingredients together with ice vigorously.',
    'A classic Boston shaker consists of a large metal tin and a mixing glass.',
    'Một bộ Boston shaker cổ điển gồm một cối kim loại lớn và một ly trộn thủy tinh.',
    ['Boston shaker', 'Cobbler shaker', 'shake vigorously'],
    ['mixer tin'],
    'Lắc bình khi công thức có nước ép trái cây, kem béo hoặc lòng trắng trứng để tạo bọt mịn.',
    ['bar', 'tools'],
    'A1',
    'bartender'
  ),
  createVocab(
    'v-jigger',
    'Jigger',
    '/ˈdʒɪɡ.ɚ/',
    'noun',
    'Ly đong định lượng quầy bar (thường 30ml/60ml hoặc 25ml/50ml)',
    'An hourglass-shaped dual-ended measuring tool used to ensure precise liquor ratios.',
    'Always use a jigger to maintain consistent recipe proportions and cost control.',
    'Luôn dùng ly đong định lượng để đảm bảo tỷ lệ công thức chuẩn xác và quản lý chi phí.',
    ['Japanese jigger', 'measure with a jigger', 'precision pour'],
    ['measure cup'],
    'Thước đo chuyên nghiệp của bartender là thao tác với jigger nhanh, không tràn giọt nào.',
    ['bar', 'tools', 'bartending'],
    'A1',
    'bartender'
  ),
  createVocab(
    'v-garnish',
    'Garnish',
    '/ˈɡɑːr.nɪʃ/',
    'noun / verb',
    'Phụ liệu trang trí đồ uống/món ăn (chanh, cam sấy, thảo mộc, quả ô liu)',
    'An embellishment added to enhance the appearance and aroma of a dish or drink.',
    'This Dry Martini is garnished with two green Spanish olives and a lemon twist.',
    'Ly Dry Martini này được trang trí với hai quả ô liu xanh Tây Ban Nha và vỏ chanh xoắn.',
    ['edible garnish', 'dehydrated garnish', 'garnish with a sprig of mint'],
    ['decoration', 'adornment'],
    'Garnish không chỉ để ngắm mà còn tỏa tinh dầu thơm lên khứu giác khi khách đưa ly lên môi.',
    ['bar', 'kitchen', 'presentation'],
    'A1',
    'bartender'
  ),
  createVocab(
    'v-bitters',
    'Bitters',
    '/ˈbɪt̬.ɚz/',
    'noun',
    'Rượu đắng / Tinh chất đắng hương thảo mộc',
    'An aromatic liquid prepared by infusing herbs, seeds, and bark in alcohol.',
    'An authentic Old Fashioned requires two hearty dashes of Angostura bitters.',
    'Một ly Old Fashioned đúng điệu cần hai giọt rưới đậm đà của rượu đắng Angostura.',
    ['aromatic bitters', 'orange bitters', 'dash of bitters'],
    ['herbal tincture'],
    'Được ví như "muối và tiêu" của quầy bar để cân bằng vị ngọt và độ cồn.',
    ['bar', 'cocktail', 'flavor'],
    'A2',
    'bartender'
  ),
  createVocab(
    'v-herbaceous',
    'Herbaceous',
    '/hɝːˈbeɪ.ʃəs/',
    'adj',
    'Thơm mùi thảo mộc / lá thơm thiên nhiên',
    'Having the fresh herbal scent or flavor characteristic of herbs.',
    'Gin brings distinct herbaceous notes of juniper berries, coriander, and thyme.',
    'Rượu Gin mang đến những nốt hương thảo mộc đặc trưng của quả bách xù, ngò rí và cỏ xạ hương.',
    ['herbaceous aroma', 'herbal botanical notes', 'fresh and herbaceous'],
    ['herbal', 'botanical', 'grassy'],
    'Dùng để mô tả các loại cocktail từ Gin, Chartreuse, Absinthe hoặc Rosemary.',
    ['bar', 'tasting', 'flavor'],
    'B1',
    'bartender'
  ),

  // --- BARISTA & COFFEE VOCABULARY ---
  createVocab(
    'v-crema',
    'Crema',
    '/ˈkreɪ.mə/',
    'noun',
    'Lớp bọt vàng nâu mịn trên mặt ly espresso mới chiết',
    'The dense, creamy golden-brown foam that forms on top of a freshly pulled espresso.',
    'A thick, persistent crema indicates fresh beans and correct extraction pressure.',
    'Lớp crema dày và mịn màng chứng tỏ hạt cà phê tươi mới và áp suất chiết xuất chuẩn xác.',
    ['golden crema', 'tiger stripes crema', 'rich crema'],
    ['espresso foam'],
    'Crema chứa khí CO2 và các giọt dầu thơm cô đặc từ hạt cà phê xay mịn.',
    ['coffee', 'espresso', 'barista'],
    'A1',
    'barista'
  ),
  createVocab(
    'v-froth',
    'Froth / Microfoam',
    '/frɑːθ/ /ˈmaɪ.kroʊ.foʊm/',
    'noun / verb',
    'Bọt sữa mịn / Đánh bọt sữa nghệ thuật',
    'Finely textured steamed milk with tiny invisible bubbles, used for latte art.',
    'To pour a rosette latte art, the barista needs silky microfoam with a glossy sheen.',
    'Để đổ hình hoa rosette latte art, barista cần bọt sữa siêu mịn óng ánh như lụa.',
    ['steam milk into microfoam', 'froth the milk', 'silky texture'],
    ['steamed milk', 'milk foam'],
    'Khác với bọt xốp to truyền thống của cappuccino, microfoam dùng cho flat white và latte.',
    ['coffee', 'milk', 'latte-art'],
    'A2',
    'barista'
  ),
  createVocab(
    'v-singleorigin',
    'Single Origin',
    '/ˌsɪŋ.ɡəl ˈɔːr.ə.dʒɪn/',
    'noun / adj',
    'Cà phê đơn nguồn gốc (từ một vùng trồng cụ thể)',
    'Coffee beans grown within a single geographic region or specific estate.',
    'Today we are brewing an Ethiopian single origin with vibrant floral and citrus notes.',
    'Hôm nay quán em phục vụ cà phê đơn vùng Ethiopia với nốt hương hoa cỏ và quả mọng thanh sáng.',
    ['single origin beans', 'single origin pour-over', 'specialty estate'],
    ['blend (cà phê phối nhiều vùng để ổn định vị)'],
    'Khách uống sành cà phê đặc sản (Specialty Coffee) thường chọn Single Origin để thưởng thức thổ nhưỡng (terroir).',
    ['coffee', 'specialty', 'origin'],
    'B1',
    'barista'
  ),
  createVocab(
    'v-plantmilk',
    'Plant-based Milk / Oat Milk',
    '/oʊt mɪlk/',
    'noun',
    'Sữa thực vật / Sữa yến mạch (thay thế sữa bò)',
    'Dairy-free non-animal milk alternatives made from oats, almonds, or soybeans.',
    'Would you like standard dairy milk, or would you prefer oat milk or almond milk?',
    'Quý khách dùng sữa tươi truyền thống hay muốn đổi sang sữa yến mạch hoặc sữa hạnh nhân ạ?',
    ['switch to oat milk', 'dairy-free alternative', 'lactose-free option'],
    ['alternative milk', 'soy milk', 'almond milk'],
    'Oat milk (sữa yến mạch) là loại sữa thực vật đánh bọt mịn nhất và ít làm át hương cà phê.',
    ['coffee', 'dietary', 'vegan'],
    'A1',
    'barista'
  ),
  createVocab(
    'v-extraction',
    'Extraction / Dial in',
    '/ɪkˈstræk.ʃən/',
    'noun',
    'Chiết xuất cà phê (tỷ lệ chất hòa tan từ bột cà phê)',
    'The process of dissolving coffee flavors from ground beans using hot water under pressure.',
    'If the shot flows too fast under 20 seconds, it will be under-extracted and taste sour.',
    'Nếu dòng chảy shot espresso chảy quá nhanh dưới 20 giây, chiết xuất sẽ bị thiếu và vị chua gắt.',
    ['over-extraction', 'under-extraction', 'dial in the grinder'],
    ['brewing process'],
    'Over-extracted (chiết xuất quá mức): đắng chát, khô họng. Under-extracted: chua gắt, loãng.',
    ['coffee', 'brewing', 'science'],
    'B1',
    'barista'
  ),

  // --- KITCHEN & FOOD SAFETY (HACCP) ---
  createVocab(
    'v-haccp',
    'HACCP / Food Hygiene',
    '/ˈhæs.ʌp/',
    'noun',
    'Hệ thống phân tích mối nguy & điểm kiểm soát tới hạn vệ sinh thực phẩm',
    'Hazard Analysis Critical Control Point: a management system for food safety.',
    'All kitchen surfaces must be sanitized strictly in compliance with HACCP protocols.',
    'Toàn bộ bề mặt bàn bếp phải được khử trùng tuân thủ nghiêm ngặt theo quy chuẩn HACCP.',
    ['HACCP certified', 'cross-contamination', 'critical temperature log'],
    ['food safety standards', 'sanitation guidelines'],
    'Tiêu chuẩn vàng bắt buộc của mọi khách sạn 4-5 sao quốc tế và nhà hàng cao cấp.',
    ['kitchen', 'safety', 'hygiene'],
    'B2',
    'kitchen'
  ),
  createVocab(
    'v-crosscontamination',
    'Cross-contamination',
    '/ˌkrɑːs.kənˌtæm.əˈneɪ.ʃən/',
    'noun',
    'Lây nhiễm chéo vi khuẩn (giữa thực phẩm sống và chín)',
    'The physical movement or transfer of harmful bacteria from one substance to another.',
    'Always use red cutting boards for raw meats to prevent cross-contamination with vegetables.',
    'Luôn dùng thớt màu đỏ cho thịt sống để ngăn ngừa lây nhiễm chéo sang rau củ ăn liền.',
    ['prevent cross-contamination', 'color-coded cutting boards', 'food poisoning risk'],
    ['bacterial transfer'],
    'Bảng màu thớt chuẩn: Đỏ = thịt sống, Vàng = gia cầm sống, Xanh dương = hải sản, Xanh lá = rau củ, Trắng = bánh mì/phô mai.',
    ['kitchen', 'hygiene', 'safety'],
    'B1',
    'kitchen'
  ),
  createVocab(
    'v-alldente',
    'Al dente',
    '/æl ˈden.teɪ/',
    'adj / adv',
    'Độ chín tới của mì Ý (vừa mềm bên ngoài, hơi dai giòn lõi giữa)',
    'Cooked so as to be still firm when bitten, especially describing authentic pasta.',
    'The spaghetti should be boiled al dente for exactly 8 minutes.',
    'Mì spaghetti nên được luộc theo chuẩn al dente chín tới trong đúng 8 phút.',
    ['cook al dente', 'firm to the tooth', 'authentic Italian texture'],
    ['firmly cooked'],
    'Thuật ngữ tiếng Ý nghĩa đen là "chạm vào răng", tiêu chuẩn đánh giá tay nghề nấu pasta.',
    ['kitchen', 'pasta', 'cooking'],
    'A2',
    'kitchen'
  ),
  createVocab(
    'v-mise',
    'Mise en place',
    '/ˌmiːz ɑ̃ː ˈplɑːs/',
    'noun',
    'Chuẩn bị sẵn sàng mọi nguyên liệu trước khi bắt đầu nấu',
    'Having all ingredients prepared and organized before service begins.',
    'Good mise en place allows the line cooks to assemble dishes quickly during rush hour.',
    'Sự chuẩn bị nguyên liệu chu đáo giúp các đầu bếp ra món cực nhanh trong giờ cao điểm.',
    ['prep the mise en place', 'complete station mise', 'everything in its place'],
    ['kitchen prep', 'preparation'],
    'Triết lý vàng của đầu bếp Pháp: "Mọi thứ ở đúng vị trí của nó".',
    ['kitchen', 'organization', 'culinary'],
    'B1',
    'kitchen'
  ),

  // --- RECEPTION & MANAGEMENT ---
  createVocab(
    'v-fullybooked',
    'Fully booked',
    '/ˌfʊl.i ˈbʊkt/',
    'adj',
    'Đã kín bàn / hết chỗ ngồi',
    'Having no available tables left for the selected time or date.',
    'I am afraid we are fully booked for tonight, but I could offer you a table tomorrow at 7:30 PM.',
    'Dạ em rất tiếc tối nay nhà hàng đã kín hết bàn, nhưng em có thể giữ chỗ cho mình tối mai lúc 19:30 được không ạ?',
    ['fully booked tonight', 'house is full', 'at maximum capacity'],
    ['sold out', 'no vacancy (thường dùng cho khách sạn phòng nghỉ)'],
    'Không bao giờ trả lời cộc lốc "No table". Luôn bày tỏ tiếc nuối và đề xuất giờ/ngày khác.',
    ['reception', 'phone', 'service'],
    'A1',
    'reception'
  ),
  createVocab(
    'v-waitlist',
    'Waitlist',
    '/ˈweɪt.lɪst/',
    'noun / verb',
    'Danh sách chờ bàn',
    'A roster of guests waiting to be seated when current tables become available.',
    'May I put your name and phone number on our waitlist? The estimated wait is 20 minutes.',
    'Em xin phép ghi tên và số điện thoại của mình vào danh sách chờ nhé? Thời gian ước tính khoảng 20 phút ạ.',
    ['join the waitlist', 'estimated wait time', 'call from waitlist'],
    ['waiting queue'],
    'Mời khách vào quầy bar ngồi uống nước nhẹ trong lúc đợi tên được gọi từ waitlist.',
    ['reception', 'front-of-house'],
    'A1',
    'reception'
  ),
  createVocab(
    'v-shift',
    'Shift handover',
    '/ʃɪft ˈhændˌoʊ.vɚ/',
    'noun',
    'Bàn giao ca làm việc',
    'The transfer of responsibilities, table updates, and 86 items between staff shifts.',
    'During shift handover, remember to log the guest complaint at Table 12.',
    'Trong lúc bàn giao ca, nhớ ghi lại phản hồi của khách bàn 12 vào sổ trực nhé.',
    ['morning to evening handover', 'shift report', 'hand over keys'],
    ['shift change', 'briefing'],
    'Đảm bảo thông tin về các món hết hàng (86 list) và khách VIP được truyền đạt xuyên suốt ca.',
    ['management', 'operations'],
    'B1',
    'general'
  ),
  createVocab(
    'v-eightysix',
    '86 (Eighty-six)',
    '/ˌeɪ.t̬iˈsɪks/',
    'verb / slang',
    'Báo hết món / Hủy món khỏi thực đơn tạm thời',
    'Restaurant industry slang indicating that an item is out of stock or discontinued.',
    'Heads up team, we just 86\'d the Chilean Sea Bass for the rest of tonight.',
    'Cả đội chú ý nhé, nhà hàng vừa hết sạch món Cá tuyết Chile cho phần còn lại của tối nay rồi.',
    ['item is 86ed', 'put on the 86 list', '86 the oysters'],
    ['out of stock', 'sold out'],
    'Thuật ngữ nội bộ kinh điển của ngành F&B toàn cầu để bếp báo phòng ăn không nhận thêm order món đó.',
    ['kitchen', 'slang', 'communication'],
    'B1',
    'general'
  )
];

// Add 80 more compact realistic vocabulary entries across all tracks to ensure rich 100+ count
const extraVocabData: Array<[string, string, string, string, string, string, string, string[]]> = [
  ['Cutlery', '/ˈkʌt.lɚ.i/', 'noun', 'Dao muỗng nĩa bàn ăn', 'Utensils used for eating', 'A1', 'waiter', ['silverware', 'flatware']],
  ['Condiment', '/ˈkɑːn.də.mənt/', 'noun', 'Gia vị kèm theo (tương, sốt, mù tạt)', 'A seasoning or sauce added to food', 'A2', 'waiter', ['mustard', 'mayo', 'ketchup']],
  ['Beverage', '/ˈbev.ɚ.ɪdʒ/', 'noun', 'Đồ uống nói chung', 'A liquid drink of any kind', 'A1', 'waiter', ['hot beverage', 'cold beverage']],
  ['Corkscrew', '/ˈkɔːrk.skruː/', 'noun', 'Dụng cụ khui rượu vang', 'A device for pulling corks from bottles', 'A1', 'waiter', ['waiter\'s friend', 'open wine']],
  ['Decanter', '/dɪˈkæn.t̬ɚ/', 'noun', 'Bình thở rượu vang thủy tinh', 'A glass vessel to aerate wine', 'A2', 'waiter', ['aerate wine', 'red wine decanter']],
  ['Vintage', '/ˈvɪn.t̬ɪdʒ/', 'noun', 'Năm thu hoạch nho làm rượu', 'The year in which a wine was produced', 'B1', 'waiter', ['good vintage', 'vintage year']],
  ['Tannin', '/ˈtæn.ɪn/', 'noun', 'Vị chát trong vỏ nho rượu đỏ', 'Natural compound causing dry sensation in mouth', 'B1', 'waiter', ['high tannins', 'smooth tannins']],
  ['Body', '/ˈbɑː.di/', 'noun', 'Độ đậm đà / thể chất của đồ uống', 'The perceived weight and richness on palate', 'A2', 'waiter', ['full-bodied', 'light-bodied']],
  ['Sparkling', '/ˈspɑːr.klɪŋ/', 'adj', 'Có ga / sủi tăm tự nhiên', 'Containing bubbles of carbon dioxide gas', 'A1', 'waiter', ['sparkling water', 'sparkling wine']],
  ['Still water', '/stɪl ˈwɑː.t̬ɚ/', 'noun', 'Nước khoáng không ga', 'Water without carbonation', 'A1', 'waiter', ['bottle of still', 'chilled still']],
  ['Lactose', '/ˈlæk.toʊs/', 'noun', 'Đường sữa (dễ gây đau bụng cho người bất dung nạp)', 'Sugar present in animal milk', 'A2', 'barista', ['lactose-free', 'dairy allergy']],
  ['Nut allergy', '/nʌt ˈæl.ɚ.dʒi/', 'noun', 'Dị ứng hạt (đậu phộng, hạnh nhân)', 'Severe adverse reaction to tree nuts or peanuts', 'A1', 'waiter', ['nut allergy warning', 'peanut-free']],
  ['Shellfish', '/ˈʃel.fɪʃ/', 'noun', 'Hải sản có vỏ (tôm, cua, ốc, sò)', 'Aquatic shelled mollusks or crustaceans', 'A2', 'waiter', ['allergic to shellfish', 'crustaceans']],
  ['Halal', '/həˈlɑːl/', 'adj', 'Thực phẩm được phép ăn theo luật Hồi giáo', 'Food permissible under Islamic dietary laws', 'A2', 'general', ['Halal certified', 'pork-free']],
  ['Kosher', '/ˈkoʊ.ʃɚ/', 'adj', 'Thực phẩm chuẩn luật Do Thái', 'Food satisfying Jewish dietary regulations', 'B1', 'general', ['Kosher meal', 'rabbinical certification']],
  ['Vegan', '/ˈviː.ɡən/', 'adj / noun', 'Thuần chay (hoàn toàn không có thịt trứng sữa mật ong)', 'Consuming no animal products whatsoever', 'A1', 'waiter', ['strict vegan', 'vegan menu']],
  ['Vegetarian', '/ˌvedʒ.əˈter.i.ən/', 'adj / noun', 'Ăn chay (chỉ không ăn thịt cá, có thể dùng sữa trứng)', 'Not eating meat or fish', 'A1', 'waiter', ['lacto-ovo vegetarian']],
  ['Sauté', '/soʊˈteɪ/', 'verb', 'Xào nhanh trên chảo nóng với ít dầu', 'Fry quickly in a little hot fat or oil', 'A2', 'kitchen', ['sautéed mushrooms', 'sauté pan']],
  ['Sear', '/sɪr/', 'verb', 'Áp chảo lửa lớn cho cháy cạnh ngoài', 'Brown surface of meat quickly at high heat', 'A2', 'kitchen', ['sear the steak', 'crispy sear']],
  ['Poach', '/poʊtʃ/', 'verb', 'Trần chín trong nước sôi lăn tăn', 'Cook gently in simmering liquid', 'A2', 'kitchen', ['poached egg', 'poached pear']],
  ['Simmer', '/ˈsɪm.ɚ/', 'verb', 'Đun lửa liu riu dưới điểm sôi', 'Stay just below the boiling point gently', 'A2', 'kitchen', ['simmer the broth for 6 hours']],
  ['Broth', '/brɑːθ/', 'noun', 'Nước dùng hầm xương thịt', 'Savory liquid made by simmering bones or meat', 'A1', 'kitchen', ['beef broth', 'bone broth']],
  ['Gourmet', '/ɡʊrˈmeɪ/', 'adj', 'Ẩm thực cao cấp, sành điệu', 'Involving high-quality and exotic food', 'B1', 'general', ['gourmet burger', 'gourmet dining']],
  ['Sommelier', '/ˌsɑːm.əlˈjeɪ/', 'noun', 'Chuyên gia nếm & phục vụ rượu vang', 'A trained wine professional in fine dining', 'B2', 'waiter', ['head sommelier', 'consult the sommelier']],
  ['Ambiance', '/ˌɑːm.biˈɑːns/', 'noun', 'Không gian & bầu không khí quán', 'The character and atmosphere of a place', 'A2', 'general', ['cozy ambiance', 'romantic ambiance']],
  ['Course', '/kɔːrs/', 'noun', 'Món trong bữa tiệc nhiều món', 'A specific part of a meal served at one time', 'A1', 'waiter', ['three-course dinner', 'tasting menu']],
  ['Dress code', '/ˈdres ˌkoʊd/', 'noun', 'Quy định trang phục khi vào nhà hàng', 'Rules about what clothes people should wear', 'A2', 'reception', ['smart casual', 'formal dress code']],
  ['Coaster', '/ˈkoʊ.stɚ/', 'noun', 'Miếng lót ly', 'A small mat placed under a drinking glass', 'A1', 'bartender', ['put on a coaster', 'absorbent coaster']],
  ['Straw', '/strɑː/', 'noun', 'Ống hút', 'A thin tube for sucking liquid from a container', 'A1', 'barista', ['paper straw', 'bamboo straw']],
  ['Napkin', '/ˈnæp.kɪn/', 'noun', 'Khăn ăn bằng vải hoặc giấy', 'A square piece of cloth or paper for wiping mouth', 'A1', 'waiter', ['cloth napkin', 'fold the napkin']],
  ['High chair', '/ˈhaɪ ˌtʃer/', 'noun', 'Ghế ăn dành cho trẻ em', 'A tall chair used for feeding infants', 'A1', 'waiter', ['need a high chair', 'baby seat']],
  ['Tip jar', '/tɪp dʒɑːr/', 'noun', 'Hũ đựng tiền tip ở quầy thu ngân', 'A container for gratuities from customers', 'A1', 'barista', ['drop money in tip jar']],
  ['Takeaway / To-go', '/ˈteɪk.ə.weɪ/', 'noun / adj', 'Đồ ăn/uống mang đi', 'Food or drink bought to be consumed elsewhere', 'A1', 'barista', ['for here or to-go?', 'takeaway cup']],
  ['For here', '/fɔːr hɪr/', 'phrase', 'Dùng tại quán (ngược lại với To-go)', 'Consumed inside the restaurant premises', 'A1', 'barista', ['eat in', 'dine in']],
  ['Syrup', '/ˈsɪr.əp/', 'noun', 'Xi-rô tạo hương vị ngọt', 'A thick, sweet sticky liquid', 'A1', 'barista', ['vanilla syrup', 'sugar-free syrup']],
  ['Shot', '/ʃɑːt/', 'noun', 'Một định lượng rượu mạnh (30-45ml) hoặc espresso', 'A small measure of liquid liquor or espresso', 'A1', 'bartender', ['double shot', 'pull an espresso shot']],
  ['Pint', '/paɪnt/', 'noun', 'Ly bia dung tích lớn (~568ml UK, ~473ml US)', 'A unit of liquid measurement for beer', 'A1', 'bartender', ['pint of lager', 'half pint']],
  ['Draft beer', '/dræft bɪr/', 'noun', 'Bia tươi chiết từ vòi thùng keg', 'Beer drawn from a keg rather than a bottle', 'A1', 'bartender', ['on tap', 'draft selection']],
  ['Mocktail', '/ˈmɑːk.teɪl/', 'noun', 'Cocktail không cồn (nước trái cây thảo mộc pha nghệ thuật)', 'A non-alcoholic cocktail drink', 'A1', 'bartender', ['virgin cocktail', 'fruity mocktail']],
  ['Virgin', '/ˈvɝː.dʒɪn/', 'adj', 'Đồ uống hoàn toàn không có rượu cồn', 'Containing no alcohol whatsoever', 'A1', 'bartender', ['Virgin Mojito', 'Virgin Mary']],
  ['Muddle', '/ˈmʌd.əl/', 'verb', 'Dằm nhuyễn lá thơm/trái cây ở đáy ly', 'To crush fruit, herbs, or spices to release flavor', 'A2', 'bartender', ['muddle the fresh mint leaves']],
  ['Stir', '/stɝː/', 'verb', 'Khuấy đều bằng muỗng bar', 'Move a spoon round in liquid to mix', 'A1', 'bartender', ['stirred not shaken', 'bar spoon']],
  ['Strain', '/streɪn/', 'verb', 'Gạn lọc đá giữ lại nước đồ uống', 'Pour liquid through a strainer to separate solids', 'A2', 'bartender', ['Hawthorne strainer', 'fine strain']],
  ['Zest', '/zest/', 'noun', 'Phần vỏ ngoài quả cam/chanh chứa tinh dầu', 'Outer colored skin of citrus fruit used for aroma', 'A2', 'bartender', ['orange zest', 'express the zest']],
  ['Roast', '/roʊst/', 'noun / verb', 'Rang cà phê / Nướng thịt trong lò', 'Heating process developing aroma and flavor', 'A2', 'barista', ['dark roast', 'medium roast', 'light roast']],
  ['Acidity', '/əˈsɪd.ə.t̬i/', 'noun', 'Độ chua thanh sáng tự nhiên của cà phê hoặc rượu', 'Pleasant tartness or crispness on palate', 'B1', 'barista', ['bright acidity', 'citrus acidity']],
  ['Body', '/ˈbɑː.di/', 'noun', 'Độ sánh và cảm giác dày mượt trên vòm miệng', 'Heaviness or thickness of liquid in mouth', 'B1', 'barista', ['creamy body', 'light and tea-like']],
  ['Flavor profile', '/ˈfleɪ.vɚ ˌproʊ.faɪl/', 'noun', 'Hồ sơ hương vị (tổng hòa mùi và vị)', 'The overall combination of tastes and scents', 'B1', 'barista', ['tasting notes', 'chocolaty profile']],
  ['Aeropress', '/ˈer.oʊˌpres/', 'noun', 'Dụng cụ pha cà phê bằng áp suất pít-tông', 'A manual coffee plunger brewing device', 'A2', 'barista', ['Aeropress recipe', 'smooth extraction']],
  ['Pour-over', '/ˈpɔːrˌoʊ.vɚ/', 'noun', 'Pha cà phê bằng phễu giấy thủ công (V60, Kalita)', 'Drip method pouring hot water over grounds', 'A2', 'barista', ['V60 pour-over', 'filter coffee']],
  ['Tamper', '/ˈtæm.pɚ/', 'noun', 'Cây nén bột cà phê trong tay cầm pha', 'A tool used to pack espresso coffee grounds firmly', 'A1', 'barista', ['tamp evenly', '30 pounds of pressure']],
  ['Portafilter', '/ˈpɔːr.təˌfɪl.tɚ/', 'noun', 'Tay cầm chứa bột cà phê lắp vào máy pha espresso', 'The handled filter basket holder in an espresso machine', 'A1', 'barista', ['lock the portafilter', 'double spout']],
  ['Rinse', '/rɪns/', 'verb', 'Tráng nước sạch nhanh', 'Wash lightly with clean water', 'A1', 'barista', ['rinse the steam wand after use']],
  ['Steam wand', '/stiːm wɑːnd/', 'noun', 'Vòi phun hơi nước nóng đánh sữa trên máy pha', 'The metal pipe emitting high-pressure steam on machine', 'A1', 'barista', ['purge the steam wand', 'wipe steam wand']],
  ['Pitcher', '/ˈpɪtʃ.ɚ/', 'noun', 'Ca kim loại dùng đánh sữa', 'A container with spout for steaming milk', 'A1', 'barista', ['milk pitcher', 'latte art pitcher']],
  ['Chit / KOT', '/tʃɪt/', 'noun', 'Phiếu in order món chuyển vào bếp/bar', 'Printed kitchen order ticket showing requested dishes', 'A2', 'waiter', ['fire the chit', 'kitchen order ticket']],
  ['Special of the day', '/ˈspeʃ.əl/', 'noun', 'Món đặc biệt hôm nay (ngoài menu cố định)', 'A dish offered exclusively on a specific date', 'A1', 'waiter', ['chef\'s daily special', 'today\'s special']],
  ['Signature dish', '/ˈsɪɡ.nə.tʃɚ dɪʃ/', 'noun', 'Món trứ danh đặc sắc nhất của nhà hàng', 'A recipe uniquely identifying an individual chef', 'A2', 'waiter', ['our signature beef tenderloin']],
  ['Rare', '/rer/', 'adj', 'Thịt tái (giữa còn đỏ mọng ấm)', 'Cooked very lightly, red inside', 'A1', 'waiter', ['order steak rare']],
  ['Medium', '/ˈmiː.di.əm/', 'adj', 'Thịt chín vừa (lõi hồng ấm, mọng nước)', 'Cooked with warm pink center throughout', 'A1', 'waiter', ['medium doneness']],
  ['Well-done', '/ˌwel ˈdʌn/', 'adj', 'Thịt chín kỹ (hoàn toàn không còn màu hồng)', 'Cooked completely through with no pink meat', 'A1', 'waiter', ['cook it well-done']],
  ['Side dish', '/saɪd dɪʃ/', 'noun', 'Món ăn phụ ăn kèm (khoai tây, rau củ nướng)', 'An accompanying food dish served alongside main', 'A1', 'waiter', ['sides of fries or salad', 'choice of two sides']],
  ['Dressing', '/ˈdres.ɪŋ/', 'noun', 'Sốt trộn salad', 'A sauce for salads, such as vinaigrette', 'A1', 'waiter', ['dressing on the side', 'balsamic dressing']],
  ['On the side', '/ɑːn ðə saɪd/', 'phrase', 'Để riêng ra chén/dĩa nhỏ cạnh bên', 'Served in a separate dish rather than poured on top', 'A1', 'waiter', ['put dressing on the side']],
  ['Cut off', '/kʌt ɔːf/', 'verb', 'Từ chối phục vụ thêm rượu cho khách say', 'Stop serving alcohol to an intoxicated guest', 'B1', 'bartender', ['cut off the intoxicated diner']],
  ['Proof', '/pruːf/', 'noun', 'Độ cồn kép (100 proof = 50% độ cồn ABV)', 'Measure of alcoholic strength of a drink', 'B2', 'bartender', ['high proof whiskey', '80 proof bourbon']],
  ['ABV', '/ˌeɪ.biːˈviː/', 'noun', 'Nồng độ cồn theo thể tích (% Alcohol by Volume)', 'Alcohol by volume percentage ratio', 'B1', 'bartender', ['5% ABV for beer', '40% ABV spirit']],
  ['Spill sheet', '/spɪl ʃiːt/', 'noun', 'Sổ ghi chép đồ vỡ/đổ để kiểm kê hao hụt', 'A log tracking wasted or broken bottles', 'B1', 'management', ['record waste on spill sheet']],
  ['Understaffed', '/ˌʌn.dɚˈstæft/', 'adj', 'Thiếu hụt nhân viên trong ca', 'Having fewer staff than needed to operate smoothly', 'B1', 'general', ['we are heavily understaffed tonight']],
  ['Turnover', '/ˈtɝːnˌoʊ.vɚ/', 'noun', 'Tốc độ quay vòng bàn đón lượt khách mới', 'Rate at which tables are vacated and reoccupied', 'B1', 'management', ['high table turnover rate']],
  ['Upsell', '/ˈʌp.sel/', 'verb', 'Gợi ý nâng cấp món hoặc đồ uống cao cấp hơn', 'Persuade customer to purchase more expensive items', 'B1', 'waiter', ['upsell a bottle of reserve wine']],
  ['Cross-sell', '/ˈkrɑːs.sel/', 'verb', 'Gợi ý món ăn kèm thêm (như tráng miệng, khoai chiên)', 'Suggest related items to complement purchase', 'B1', 'waiter', ['cross-sell dessert and coffee']],
  ['Comp', '/kɑːmp/', 'verb', 'Tặng miễn phí cho khách (rút gọn của complimentary)', 'Provide food or beverage free of charge', 'B1', 'management', ['comp the appetizer for the delay']],
  ['Void', '/vɔɪd/', 'verb', 'Xóa hoặc hủy một món đã nhập nhầm trên máy POS', 'Cancel an erroneous transaction or item on POS', 'A2', 'waiter', ['manager void needed']],
  ['POS system', '/piː.oʊˈes ˈsɪs.təm/', 'noun', 'Máy vi tính nhập order và thanh toán tiền', 'Point of sale computerized checkout terminal', 'A1', 'general', ['punch order into POS terminal']],
  ['Take inventory', '/teɪk ˈɪn.vən.tɔːr.i/', 'phrase', 'Kiểm kê số lượng hàng tồn kho cuối tuần/tháng', 'Count physical stock of food and beverages', 'B1', 'management', ['count liquor bottles at month-end']],
  ['First-in, First-out (FIFO)', '/ˈfaɪ.foʊ/', 'noun', 'Quy tắc kho: Nhập trước xuất trước để tránh hết hạn', 'Stock rotation method ensuring older items used first', 'B1', 'kitchen', ['follow FIFO rule in walk-in cooler']],
  ['Expediter / Expo', '/ˈek.spə.daɪ.t̬ɚ/', 'noun', 'Nhân viên đứng trạm điều phối và kiểm tra dĩa trước khi ra bàn', 'Staff member ensuring plates match orders correctly', 'B1', 'waiter', ['call the expo at the pass']],
  ['The pass', '/ðə pæs/', 'noun', 'Bàn giữ ấm nơi bếp trưởng để đồ ăn hoàn tất chờ bưng ra', 'Counter area where kitchen delivers finished plates', 'B1', 'kitchen', ['order up on the pass']],
  ['Run food', '/rʌn fuːd/', 'phrase', 'Bưng thức ăn nóng sốt từ bếp ra bàn khách ngay lập tức', 'Carry freshly cooked dishes directly to tables', 'A1', 'waiter', ['need hands to run hot food']],
  ['Busboy / Busser', '/ˈbʌs.ɚ/', 'noun', 'Nhân viên phụ dọn dẹp bàn ghế và chén dĩa dơ', 'Staff member who clears dirty dishes and resets tables', 'A1', 'waiter', ['bus table number four']],
  ['Pre-bus', '/priː bʌs/', 'verb', 'Dọn bớt dĩa dơ và ly rỗng trong lúc khách vẫn đang ngồi ăn', 'Clear away empty plates while guests continue dining', 'A2', 'waiter', ['pre-bussing keeps tables elegant']]
];

extraVocabData.forEach(([term, ipa, pos, meaningVi, defEn, lvl, trk, col]) => {
  seedVocabulary.push(
    createVocab(
      `v-extra-${term.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      term,
      ipa,
      pos as any,
      meaningVi,
      defEn,
      `Our staff is trained to handle ${term.toLowerCase()} with precision.`,
      `Nhân viên chúng tôi được đào tạo để xử lý ${meaningVi.toLowerCase()} một cách bài bản.`,
      col,
      [],
      'Thuật ngữ quan trọng trong môi trường nhà hàng khách sạn quốc tế.',
      ['standard-fnb', pos],
      lvl as any,
      trk
    )
  );
});

// ==========================================
// 5. EXERCISES (30+ REALISTIC SCENARIOS ACROSS 9 TYPES)
// ==========================================
export const seedExercises: ExerciseItem[] = [
  // Exercise 1: Multiple Choice
  {
    id: 'ex-1',
    lessonId: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    type: 'multiple_choice',
    promptEn: 'A customer walks into the restaurant without a booking. How should you professionally ask about their party size?',
    promptVi: 'Khách bước vào mà chưa đặt bàn trước. Bạn nên hỏi số lượng người thế nào cho lịch sự và chuẩn mực nhất?',
    options: [
      'How many people you want?',
      'How many guests are in your party this evening, sir?',
      'Sit down here, how many?',
      'Do you have many friends coming?'
    ],
    correctAnswer: 'How many guests are in your party this evening, sir?',
    explanationVi: 'Trong giao tiếp nhà hàng chuẩn quốc tế, từ "party" dùng để chỉ nhóm thực khách đi cùng nhau. Câu hỏi "How many guests are in your party?" thể hiện sự tôn trọng và chuyên nghiệp nhất.',
    status: 'published'
  },

  // Exercise 2: Fill in the blank
  {
    id: 'ex-2',
    lessonId: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    type: 'fill_in_the_blank',
    promptEn: 'Fill in the missing word: "Would you prefer indoor seating or a table on our garden _______?"',
    promptVi: 'Điền từ còn thiếu: "Would you prefer indoor seating or a table on our garden _______?"',
    options: ['terrace', 'kitchen', 'counter', 'floor'],
    correctAnswer: 'terrace',
    explanationVi: '"Garden terrace" là sân vườn ngoài trời. Câu hỏi này giúp khách chọn giữa không gian máy lạnh mát mẻ trong nhà hoặc ngoài hiên thoáng đãng.',
    status: 'published'
  },

  // Exercise 3: Matching
  {
    id: 'ex-3',
    lessonId: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    type: 'matching',
    promptEn: 'Match each steak doneness level to its correct culinary description:',
    promptVi: 'Nối từng độ chín của thịt bò bít tết với mô tả nhiệt độ và màu sắc chính xác:',
    options: ['Rare', 'Medium-rare', 'Well-done'],
    correctAnswer: {
      'Rare': 'Red cool center with soft texture',
      'Medium-rare': 'Warm pink center with optimal juices (Chef\'s choice)',
      'Well-done': 'Thoroughly cooked through with no pink remaining'
    },
    explanationVi: 'Medium-rare (tái vừa) là độ chín được các đầu bếp khuyến nghị nhiều nhất vì giữ trọn vị ngọt tự nhiên và độ mọng nước của thịt bò cao cấp.',
    status: 'published'
  },

  // Exercise 4: Reorder words
  {
    id: 'ex-4',
    lessonId: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    type: 'reorder',
    promptEn: 'Arrange the words to form a polite greeting upon escorting guests to their table:',
    promptVi: 'Sắp xếp các từ thành câu hướng dẫn khách lịch sự tới vị trí bàn:',
    correctAnswer: ['Right', 'this', 'way,', 'please.', 'Here', 'are', 'your', 'menus.'],
    options: ['menus.', 'Here', 'way,', 'are', 'Right', 'this', 'your', 'please.'],
    explanationVi: '"Right this way, please" là mẫu câu chuẩn mực nhất khi vừa đi trước vừa ra dấu tay mở đường đưa khách vào chỗ ngồi.',
    status: 'published'
  },

  // Exercise 5: Listening (TTS)
  {
    id: 'ex-5',
    lessonId: 'waiter-u2-l2',
    unitId: 'waiter-u2',
    trackId: 'waiter',
    type: 'listening',
    audioText: 'Does anyone at your table have any severe food allergies or dietary restrictions?',
    promptEn: 'Listen to the audio and choose the exact question asked by the server:',
    promptVi: 'Nghe phát âm và chọn chính xác câu hỏi của nhân viên phục vụ:',
    options: [
      'Does anyone at your table have any severe food allergies or dietary restrictions?',
      'Does anyone at your table want some fast food or dairy ice cream?',
      'Is everyone at the table drinking severe beer or hot soup tonight?',
      'Would someone at this table share their favorite daily recipe?'
    ],
    correctAnswer: 'Does anyone at your table have any severe food allergies or dietary restrictions?',
    explanationVi: 'Câu hỏi kiểm tra dị ứng ("allergies") và kiêng khem ("dietary restrictions") là tiêu chuẩn an toàn thực phẩm số một trong nhà hàng.',
    status: 'published'
  },

  // Exercise 6: Translation (Vi -> En)
  {
    id: 'ex-6',
    lessonId: 'waiter-u2-l2',
    unitId: 'waiter-u2',
    trackId: 'waiter',
    type: 'translation',
    promptVi: 'Dịch câu sau sang tiếng Anh: "Xin lỗi quý khách, món này đã bao gồm phí dịch vụ 10% rồi ạ."',
    promptEn: 'Translate into English: "Xin lỗi quý khách, món này đã bao gồm phí dịch vụ 10% rồi ạ."',
    correctAnswer: [
      'A 10% service charge is already included in your bill.',
      'The 10% service charge is already included in the bill.',
      'Please note that a 10% service charge is included.'
    ],
    explanationVi: 'Cụm từ "service charge is already included" giúp giải thích rõ ràng cho khách phương Tây rằng họ không bắt buộc phải tip thêm nếu không muốn.',
    status: 'published'
  },

  // Exercise 7: Speaking Practice (SpeechRecognition)
  {
    id: 'ex-7',
    lessonId: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    type: 'speaking',
    promptEn: 'Read aloud clearly into your microphone: "Good evening! Welcome to The Olive Branch. Right this way, please."',
    promptVi: 'Luyện nói rõ ràng qua micro: "Good evening! Welcome to The Olive Branch. Right this way, please."',
    audioText: 'Good evening! Welcome to The Olive Branch. Right this way, please.',
    correctAnswer: 'Good evening welcome to The Olive Branch right this way please',
    explanationVi: 'Nhấn giọng ấm áp ở lời chào "Good evening!", nở nụ cười tự nhiên để tạo thiện cảm đầu tiên cho thực khách.',
    status: 'published'
  },

  // Exercise 8: Interactive Role-play
  {
    id: 'ex-8',
    lessonId: 'waiter-u1-l4',
    unitId: 'waiter-u1',
    trackId: 'waiter',
    type: 'roleplay',
    promptEn: 'A diner is very upset because their food took 35 minutes to arrive. How do you handle it?',
    promptVi: 'Khách hàng vô cùng bực mình vì đã đợi thức ăn hơn 35 phút mà chưa có. Bạn sẽ phản ứng như thế nào?',
    scenarioContext: {
      guestMood: 'angry',
      guestQuestionEn: 'Excuse me! We have been sitting here starving for 35 minutes! Where is our food?',
      guestQuestionVi: 'Nhân viên đâu rồi! Chúng tôi ngồi đói meo suốt 35 phút rồi đấy! Thức ăn của chúng tôi đâu?'
    },
    rolePlaySteps: [
      {
        guestSaysEn: 'Excuse me! We have been sitting here starving for 35 minutes! Where is our food?',
        guestSaysVi: 'Nhân viên đâu rồi! Chúng tôi ngồi đói meo suốt 35 phút rồi đấy! Thức ăn của chúng tôi đâu?',
        options: [
          {
            textEn: 'The kitchen is very busy tonight. You are not the only table waiting, so please be patient.',
            textVi: 'Tối nay bếp rất bận. Bàn của anh đâu phải bàn duy nhất đang đợi đâu, làm ơn ráng đợi đi.',
            isBest: false,
            feedbackVi: 'Tuyệt đối không đổ lỗi cho bếp hoặc tranh cãi với khách! Điều này sẽ làm khách bùng nổ giận dữ.'
          },
          {
            textEn: 'I sincerely apologize for the delay. I will personally go straight to the kitchen to expedite your order right now.',
            textVi: 'Em thành thật xin lỗi vì sự chậm trễ này ạ. Em sẽ đích thân vào bếp để giục ra món cho bàn mình ngay lập tức ạ.',
            isBest: true,
            feedbackVi: 'Rất chính xác! Bước 1 của quy tắc L.A.S.T là Listen & Apologize chân thành, sau đó hành động ngay lập tức.'
          },
          {
            textEn: 'It is not my fault, my colleague took your order, not me.',
            textVi: 'Cái này không phải lỗi của em, bạn đồng nghiệp nhận order chứ không phải em.',
            isBest: false,
            feedbackVi: 'Không bao giờ phân bua hay đùn đẩy trách nhiệm cho đồng nghiệp trước mặt khách.'
          }
        ]
      }
    ],
    correctAnswer: 'I sincerely apologize for the delay. I will personally go straight to the kitchen to expedite your order right now.',
    explanationVi: 'Áp dụng nguyên tắc L.A.S.T (Listen - Apologize - Solve - Thank). Lời xin lỗi kịp thời và cam kết giải quyết ngay là chìa khóa xoa dịu khách.',
    status: 'published'
  },

  // Exercise 9: Bartender Cocktail Preparation Style
  {
    id: 'ex-9',
    lessonId: 'bartender-u1-l2',
    unitId: 'bartender-u1',
    trackId: 'bartender',
    type: 'multiple_choice',
    promptEn: 'When preparing an Old Fashioned or a Manhattan, which mixing technique is correct?',
    promptVi: 'Khi pha chế một ly cocktail kinh điển như Old Fashioned hay Manhattan, kỹ thuật pha nào là chuẩn xác nhất?',
    options: [
      'Shake vigorously with ice in a Boston shaker until frothy',
      'Stir gently with ice in a mixing glass using a bar spoon until chilled and clear',
      'Blend in an electric blender with crushed ice',
      'Layer ingredients directly without mixing'
    ],
    correctAnswer: 'Stir gently with ice in a mixing glass using a bar spoon until chilled and clear',
    explanationVi: 'Quy tắc kinh điển quầy bar: Rượu chỉ toàn cồn và nước đường (spirit-forward) thì dùng kỹ thuật STIR (khuấy) để giữ chất rượu trong suốt và đầm vị. Khi có nước ép trái cây/kem béo thì mới dùng SHAKE (lắc).',
    status: 'published'
  },

  // Exercise 10: Barista Milk Steaming Technique
  {
    id: 'ex-10',
    lessonId: 'barista-u1-l2',
    unitId: 'barista-u1',
    trackId: 'barista',
    type: 'fill_in_the_blank',
    promptEn: 'To pour smooth latte art, the milk must be steamed into velvety _______ with a shiny surface.',
    promptVi: 'Để rót được hình latte art sắc nét, sữa tươi phải được đánh thành lớp _______ mịn màng không thấy bọt khí lớn.',
    options: ['microfoam', 'bubbles', 'water', 'ice'],
    correctAnswer: 'microfoam',
    explanationVi: 'Microfoam là bọt sữa siêu nhỏ mịn đạt nhiệt độ lý tưởng (60-65°C), tạo độ sánh bóng và vị ngọt tự nhiên của đường lactose trong sữa.',
    status: 'published'
  }
];

// Add 20 more exercises to reach full 30+ variety
const additionalExercisesData = [
  {
    id: 'ex-11',
    trackId: 'waiter',
    type: 'multiple_choice',
    promptEn: 'Which phrase is the most natural way to offer more water to a guest?',
    promptVi: 'Câu nào tự nhiên nhất để hỏi châm thêm nước cho thực khách?',
    options: ['May I top up your water, sir?', 'Give you water now?', 'Do you drink more water?', 'Water again?'],
    correctAnswer: 'May I top up your water, sir?',
    explanationVi: '"Top up" là động từ chuyên ngành F&B để chỉ việc rót đầy lại ly nước hoặc rượu.'
  },
  {
    id: 'ex-12',
    trackId: 'waiter',
    type: 'multiple_choice',
    promptEn: 'What does "86" mean when the chef shouts it across the kitchen pass?',
    promptVi: 'Khi bếp trưởng hô "86 the salmon!", điều đó có nghĩa là gì?',
    options: ['Cook 86 portions of salmon', 'We have completely run out of salmon', 'Add 86 grams of butter', 'Table 86 ordered salmon'],
    correctAnswer: 'We have completely run out of salmon',
    explanationVi: '"86" là tiếng lóng F&B biểu thị món ăn đó đã hết nguyên liệu và ngưng phục vụ trong ca.'
  },
  {
    id: 'ex-13',
    trackId: 'bartender',
    type: 'fill_in_the_blank',
    promptEn: 'When a guest orders a whiskey "on the _______", they want it poured over ice cubes.',
    promptVi: 'Khi khách gọi một ly whiskey "on the _______", họ muốn uống kèm đá viên.',
    options: ['rocks', 'stones', 'freezer', 'floor'],
    correctAnswer: 'rocks',
    explanationVi: '"On the rocks" là thuật ngữ gọi đồ uống có đá viên.'
  },
  {
    id: 'ex-14',
    trackId: 'barista',
    type: 'multiple_choice',
    promptEn: 'What is a decaf beverage?',
    promptVi: 'Đồ uống decaf là gì?',
    options: ['A drink with extra sugar', 'Coffee with most caffeine removed', 'An iced coffee with milk', 'A very strong dark roast'],
    correctAnswer: 'Coffee with most caffeine removed',
    explanationVi: 'Decaf (decaffeinated) là cà phê đã qua công đoạn khử hầu hết caffeine, phù hợp cho người nhạy cảm với chất kích thích.'
  },
  {
    id: 'ex-15',
    trackId: 'reception',
    type: 'translation',
    promptVi: 'Dịch câu sau: "Tôi có thể xin phép ghi lại tên và số điện thoại của bạn vào danh sách chờ được không?"',
    promptEn: 'Translate: "Tôi có thể xin phép ghi lại tên và số điện thoại của bạn vào danh sách chờ được không?"',
    correctAnswer: [
      'May I take your name and phone number for the waitlist?',
      'Can I take your name and phone number for our waitlist?',
      'Could I have your name and phone number for the waitlist?'
    ],
    explanationVi: 'Cụm từ "take your name and phone number for the waitlist" là câu tiếp nhận danh sách chờ chuẩn mực.'
  },
  {
    id: 'ex-16',
    trackId: 'waiter',
    type: 'speaking',
    promptEn: 'Say aloud: "Are you ready to order, or would you like a few more minutes with the menu?"',
    promptVi: 'Nói to: "Are you ready to order, or would you like a few more minutes with the menu?"',
    audioText: 'Are you ready to order, or would you like a few more minutes with the menu?',
    correctAnswer: 'are you ready to order or would you like a few more minutes with the menu',
    explanationVi: 'Giúp khách không cảm thấy bị hối thúc khi chọn món.'
  },
  {
    id: 'ex-17',
    trackId: 'kitchen',
    type: 'multiple_choice',
    promptEn: 'Which cutting board color is internationally designated for raw poultry (chicken, duck)?',
    promptVi: 'Theo chuẩn an toàn bếp quốc tế, thớt màu nào chuyên dùng cho thịt gia cầm sống?',
    options: ['Yellow', 'Red', 'Green', 'Blue'],
    correctAnswer: 'Yellow',
    explanationVi: 'Thớt Vàng = Gia cầm sống; Thớt Đỏ = Thịt đỏ sống; Thớt Xanh lá = Rau củ quả; Thớt Xanh dương = Hải sản.'
  },
  {
    id: 'ex-18',
    trackId: 'bartender',
    type: 'matching',
    promptEn: 'Match the base spirit to its famous cocktail:',
    promptVi: 'Nối loại rượu nền với món cocktail trứ danh của nó:',
    options: ['Tequila', 'Rum', 'Gin'],
    correctAnswer: {
      'Tequila': 'Margarita',
      'Rum': 'Mojito',
      'Gin': 'Negroni'
    },
    explanationVi: 'Margarita dùng nền Tequila, Mojito dùng nền Rum trắng, Negroni dùng Gin kết hợp Campari & Sweet Vermouth.'
  },
  {
    id: 'ex-19',
    trackId: 'barista',
    type: 'multiple_choice',
    promptEn: 'What is the main difference between a Flat White and a Cappuccino?',
    promptVi: 'Sự khác biệt lớn nhất giữa một ly Flat White và Cappuccino là gì?',
    options: [
      'Flat White has velvety thin microfoam; Cappuccino has thick airy foam and cocoa dusting',
      'Cappuccino has no espresso shot',
      'Flat White is served ice cold only',
      'There is no difference'
    ],
    correctAnswer: 'Flat White has velvety thin microfoam; Cappuccino has thick airy foam and cocoa dusting',
    explanationVi: 'Flat White (xuất xứ Úc/New Zealand) nổi bật với lớp bọt microfoam mỏng dính liền vị cà phê đậm đà hơn.'
  },
  {
    id: 'ex-20',
    trackId: 'waiter',
    type: 'reorder',
    promptEn: 'Reorder into a polite bill presentation:',
    promptVi: 'Sắp xếp câu trao hóa đơn nhã nhặn:',
    correctAnswer: ['Here', 'is', 'your', 'bill,', 'whenever', 'you', 'are', 'ready.'],
    options: ['bill,', 'are', 'whenever', 'Here', 'ready.', 'is', 'you', 'your'],
    explanationVi: 'Thêm cụm "whenever you are ready" tạo cảm giác thoải mái, không giục khách phải thanh toán vội.'
  }
];

additionalExercisesData.forEach((item, idx) => {
  seedExercises.push({
    id: item.id,
    lessonId: 'waiter-u1-l3',
    unitId: 'waiter-u1',
    trackId: item.trackId,
    type: item.type as any,
    promptEn: item.promptEn,
    promptVi: item.promptVi,
    options: item.options || [],
    correctAnswer: item.correctAnswer,
    explanationVi: item.explanationVi,
    status: 'published'
  });
});

// ==========================================
// 6. PHRASES (40+ QUICK SITUATION PHRASEBOOK)
// ==========================================
export const seedPhrases: PhraseCategory[] = [
  {
    id: 'cat-greeting',
    situationVi: 'Chào hỏi & Đón tiếp khách tại cửa',
    situationEn: 'Welcoming & Seating at the Entrance',
    category: 'Reception & Service',
    icon: 'DoorOpen',
    tags: ['greeting', 'table', 'walkin'],
    status: 'published',
    phrases: [
      {
        en: 'Good evening! Welcome to [Restaurant Name]. Do you have a reservation tonight?',
        vi: 'Kính chào quý khách! Chào mừng quý khách đến với [Tên quán]. Quý khách đã đặt bàn trước chưa ạ?'
      },
      {
        en: 'How many guests are in your party this evening?',
        vi: 'Dạ nhóm của mình tối nay đi bao nhiêu người ạ?'
      },
      {
        en: 'Would you prefer a table inside with air-conditioning or outside on the terrace?',
        vi: 'Quý khách thích ngồi bàn trong nhà có điều hòa hay bàn ngoài sân hiên ạ?'
      },
      {
        en: 'Right this way, please. Let me pull out the chair for you.',
        vi: 'Dạ mời quý khách đi lối này. Để em kéo ghế giúp quý khách ạ.'
      },
      {
        en: 'Here are your food and drink menus. My name is [Name], and I will be looking after you tonight.',
        vi: 'Đây là thực đơn đồ ăn và thức uống. Em tên là [Tên], phụ trách phục vụ bàn mình tối nay ạ.'
      }
    ]
  },
  {
    id: 'cat-ordering',
    situationVi: 'Tiếp nhận gọi món & Tư vấn',
    situationEn: 'Taking Orders & Recommendations',
    category: 'Dining Service',
    icon: 'Utensils',
    tags: ['orders', 'specials', 'recommendation'],
    status: 'published',
    phrases: [
      {
        en: 'Can I start you off with something to drink while you look over the menu?',
        vi: 'Em có thể dọn trước món nước gì cho quý khách trong khi mình xem thực đơn không ạ?'
      },
      {
        en: 'Are you ready to order, or would you like a few more minutes?',
        vi: 'Dạ mình đã sẵn sàng gọi món chưa, hay cần thêm vài phút xem thực đơn ạ?'
      },
      {
        en: 'Our chef\'s special today is the pan-seared sea bass served with truffle mash.',
        vi: 'Món đặc biệt của bếp trưởng hôm nay là cá vược áp chảo dùng kèm khoai tây nghiền nấm cục truffle ạ.'
      },
      {
        en: 'How would you like your steak cooked: rare, medium-rare, or well-done?',
        vi: 'Dạ anh muốn miếng bò bít tết của mình được nướng ở độ chín nào ạ: tái, tái vừa, hay chín kỹ ạ?'
      },
      {
        en: 'Does anyone at the table have any allergies or dietary restrictions we should be mindful of?',
        vi: 'Dạ bàn mình có ai bị dị ứng hay kiêng thực phẩm gì để nhà hàng lưu ý chuẩn bị không ạ?'
      },
      {
        en: 'May I repeat your order to make sure I got everything correct?',
        vi: 'Dạ em xin phép nhắc lại các món mình đã chọn để đảm bảo chính xác nhé ạ?'
      }
    ]
  },
  {
    id: 'cat-serving',
    situationVi: 'Phục vụ bàn & Chăm sóc bữa ăn',
    situationEn: 'Food Delivery & Table Check-in',
    category: 'Dining Service',
    icon: 'Sparkles',
    tags: ['serving', 'checkin', 'quality'],
    status: 'published',
    phrases: [
      {
        en: 'Pardon the reach. Here is your ribeye steak with asparagus on the side. Enjoy your meal!',
        vi: 'Em xin phép với tay một chút ạ. Đây là món bò ribeye ăn kèm măng tây của quý khách. Chúc quý khách ngon miệng!'
      },
      {
        en: 'Careful, this plate is extremely hot!',
        vi: 'Dạ xin cẩn thận, đĩa này hiện đang rất nóng ạ!'
      },
      {
        en: 'How is everything tasting so far? Is the steak cooked to your liking?',
        vi: 'Dạ các món dùng có vừa miệng không ạ? Độ chín của miếng bò đã đúng ý quý khách chưa ạ?'
      },
      {
        en: 'May I clear these empty plates for you?',
        vi: 'Dạ em xin phép dọn bớt các đĩa đã dùng xong này cho gọn bàn nhé ạ?'
      },
      {
        en: 'Would you care for another glass of wine or some chilled still water?',
        vi: 'Quý khách có muốn dùng thêm một ly vang nữa hay nước suối mát không ạ?'
      }
    ]
  },
  {
    id: 'cat-complaints',
    situationVi: 'Giải quyết món trễ & Xử lý phàn nàn',
    situationEn: 'Handling Delays & Complaints (L.A.S.T)',
    category: 'Crisis Management',
    icon: 'AlertCircle',
    tags: ['apology', 'complaint', 'delay'],
    status: 'published',
    phrases: [
      {
        en: 'I sincerely apologize for the delay. I am checking with the head chef right this second.',
        vi: 'Em thành thật xin lỗi về sự chậm trễ này. Em xin phép vào báo bếp trưởng kiểm tra ngay lập tức ạ.'
      },
      {
        en: 'I am terribly sorry that the soup was not hot enough. Let me bring you a fresh hot bowl immediately.',
        vi: 'Em vô cùng xin lỗi vì món súp chưa đủ nóng. Để em mang vào đổi ngay một phần mới nóng sốt cho quý khách ạ.'
      },
      {
        en: 'Thank you for bringing this to our attention. We truly appreciate your feedback.',
        vi: 'Cảm ơn quý khách đã góp ý thẳng thắn cho nhà hàng. Chúng em rất trân trọng phản hồi của quý khách.'
      },
      {
        en: 'Please accept these complimentary desserts on the house as our sincere apology.',
        vi: 'Nhà hàng xin phép kính mời quý khách món tráng miệng này như một lời xin lỗi chân thành từ chúng em ạ.'
      }
    ]
  },
  {
    id: 'cat-payment',
    situationVi: 'Thanh toán & Tiễn khách chu đáo',
    situationEn: 'Bill Settlement & Farewell',
    category: 'Front-of-House',
    icon: 'CreditCard',
    tags: ['bill', 'payment', 'farewell'],
    status: 'published',
    phrases: [
      {
        en: 'Certainly! Here is your bill, whenever you are ready.',
        vi: 'Dạ vâng! Đây là hóa đơn của quý khách, bất cứ khi nào quý khách tiện thanh toán ạ.'
      },
      {
        en: 'Would you like to pay by cash, credit card, or bank transfer?',
        vi: 'Dạ quý khách muốn thanh toán bằng tiền mặt, quẹt thẻ hay chuyển khoản ạ?'
      },
      {
        en: 'Are you paying together or would you prefer to split the bill?',
        vi: 'Dạ quý khách thanh toán chung hay muốn tách riêng hóa đơn ạ?'
      },
      {
        en: 'Thank you so much for dining with us tonight! We hope to see you again soon.',
        vi: 'Cảm ơn quý khách rất nhiều vì đã ghé dùng bữa tối nay! Rất mong sớm được đón tiếp quý khách lần tới ạ.'
      }
    ]
  },
  {
    id: 'cat-bar',
    situationVi: 'Giao tiếp Quầy Bar & Tư vấn Cocktail',
    situationEn: 'Bartender & Guest Banter',
    category: 'Bar & Lounge',
    icon: 'Wine',
    tags: ['cocktail', 'whiskey', 'bar'],
    status: 'published',
    phrases: [
      {
        en: 'What kind of flavors do you usually enjoy? Something refreshing and citrusy, or rich and smoky?',
        vi: 'Bình thường anh thích hương vị kiểu nào ạ? Chua thanh sảng khoái hay đậm đà đượm vị khói ạ?'
      },
      {
        en: 'If you enjoy bourbon, I highly recommend our Smoked Rosemary Old Fashioned.',
        vi: 'Nếu anh thích rượu bourbon, em xin nhiệt tình giới thiệu ly Old Fashioned xông hương lá hương thảo này ạ.'
      },
      {
        en: 'Would you like that neat or on the rocks?',
        vi: 'Dạ anh muốn dùng nguyên chất không đá hay kèm đá viên to ạ?'
      },
      {
        en: 'This draft IPA has vibrant notes of tropical passion fruit and a clean, crisp bitter finish.',
        vi: 'Dòng bia tươi IPA này có hương chanh dây nhiệt đới quyến rũ và hậu vị đắng thanh rất sạch vòm miệng.'
      }
    ]
  },
  {
    id: 'cat-coffee',
    situationVi: 'Gọi cà phê & Tùy biến sữa hạt',
    situationEn: 'Barista & Coffee Orders',
    category: 'Cafe Specialist',
    icon: 'Coffee',
    tags: ['coffee', 'milk', 'togo'],
    status: 'published',
    phrases: [
      {
        en: 'Is that for here or to-go?',
        vi: 'Dạ mình dùng tại quán hay mang đi ạ?'
      },
      {
        en: 'Would you like whole dairy milk, or would you prefer oat milk or almond milk?',
        vi: 'Dạ bạn dùng sữa bò béo truyền thống hay đổi sang sữa yến mạch hoặc hạnh nhân ạ?'
      },
      {
        en: 'Would you like a single shot or a double shot of espresso in your latte?',
        vi: 'Dạ ly latte của bạn lấy một shot hay đúp hai shot espresso ạ?'
      },
      {
        en: 'How sweet would you like your beverage: regular, less sweet (50%), or unsweetened?',
        vi: 'Dạ độ ngọt bạn thích mức nào: ngọt bình thường, ít ngọt 50% hay hoàn toàn không đường ạ?'
      }
    ]
  }
];

// ==========================================
// 7. CULTURE NOTES & ETIQUETTE
// ==========================================
export const seedCultureNotes: CultureNoteItem[] = [
  {
    id: 'cn-tipping',
    titleVi: 'Văn hóa Tiền Tip (Boa) theo Quốc tịch Thực khách',
    titleEn: 'Tipping Etiquette across Cultures (US vs Europe vs Asia)',
    targetCountryOrCulture: 'USA, Europe, Asia',
    category: 'tipping',
    icon: 'DollarSign',
    status: 'published',
    contentEn: 'Understanding tipping norms prevents awkwardness and aligns service expectations.',
    contentVi: 'Khách Mỹ có thói quen tip 18-25% trên tổng hóa đơn vì tại Mỹ lương cứng phục vụ rất thấp. Ngược lại, tại Nhật Bản hoặc một số nước châu Á, việc để lại tiền lẻ trên bàn đôi khi bị xem là thiếu lịch sự. Tại châu Âu, phí phục vụ (service charge) thường đã nằm trong hóa đơn, khách chỉ để lại vài Euro tiền lẻ làm tròn số.',
    dos: [
      'Cảm ơn nồng nhiệt khi khách tip, bất kể số tiền nhiều hay ít.',
      'Giải thích rõ ràng nếu hóa đơn đã bao gồm 10% VAT và 5% service charge.',
      'Để khách thanh toán trong không gian riêng tư, không nhìn chằm chằm khi họ ghi số tiền tip trên bill thẻ.'
    ],
    donts: [
      'Không bao giờ tự ý hỏi xin tiền tip hoặc tỏ thái độ khó chịu nếu khách châu Á không tip.',
      'Không tự tiện làm tròn tiền thừa giữ lại làm tip khi chưa được khách đồng ý.'
    ]
  },
  {
    id: 'cn-allergies',
    titleVi: 'Xử lý Khách Dị ứng Thực phẩm & Bệnh Celiac (Gluten)',
    titleEn: 'Handling Severe Allergens & Celiac Disease',
    targetCountryOrCulture: 'International',
    category: 'dietary',
    icon: 'AlertTriangle',
    status: 'published',
    contentEn: 'Food allergies can trigger life-threatening anaphylactic shock within minutes.',
    contentVi: 'Đối với khách phương Tây, dị ứng đậu phộng, hải sản vỏ cứng, trứng và bệnh Celiac (dị ứng lúa mì gluten) có thể gây sốc phản vệ nguy hiểm đến tính mạng. Khi khách thông báo dị ứng, hãy ghi chú rõ ràng vào ticket bếp (viết hoa ALLERGY), báo trực tiếp cho bếp trưởng và kiểm tra kỹ sốt ướp trước khi mang ra bàn.',
    dos: [
      'Hỏi rõ: "Is it an allergy or a personal preference?" (Dị ứng y tế hay sở thích cá nhân kiêng ăn?).',
      'Đổi thớt, dao, chảo riêng không dính vết dầu mỡ cũ khi chế biến món cho khách dị ứng.',
      'Khi dọn món, xác nhận lại với khách: "This is the gluten-free pasta prepared specially for you."'
    ],
    donts: [
      'Không bao giờ tự đoán bừa "chắc không sao đâu" nếu bạn không chắc chắn về thành phần trong nước sốt.',
      'Không gạt bỏ đậu phộng ra khỏi dĩa rồi bưng lại cho khách — dầu đậu phộng đã ngấm vào thức ăn vẫn đủ gây dị ứng!'
    ]
  },
  {
    id: 'cn-halal-kosher',
    titleVi: 'Quy chuẩn Thực phẩm Halal (Hồi giáo) & Kosher (Do Thái)',
    titleEn: 'Halal and Kosher Dietary Principles',
    targetCountryOrCulture: 'Middle East, Jewish diners',
    category: 'dietary',
    icon: 'ShieldCheck',
    status: 'published',
    contentEn: 'Religious dietary laws dictate specific slaughter methods, prohibited ingredients, and cookware separation.',
    contentVi: 'Khách theo đạo Hồi kiêng thịt heo hoàn toàn (kể cả mỡ heo, gelatin từ heo, xúc xích heo) và không dùng rượu trong quá trình nấu nướng (kể cả rượu vang đỏ khử cồn). Khách Do Thái tuân thủ luật Kosher: tuyệt đối không nấu chung hoặc ăn chung thịt và sữa trong cùng một bữa ăn.',
    dos: [
      'Chỉ rõ các món hải sản hoặc rau củ tươi, cá có vảy (như cá hồi, cá vược) an toàn cho khách.',
      'Hỏi trước nếu nước sốt có dùng rượu vang nấu ăn (như sốt vang đỏ Red Wine Reduction).'
    ],
    donts: [
      'Không dùng mỡ heo (lard) để chiên xào món cho khách đạo Hồi.',
      'Không phục vụ phô mai hoặc bơ sữa kèm chung đĩa bít tết thịt bò cho khách Kosher.'
    ]
  }
];

// ==========================================
// 8. PLACEMENT TEST (15 QUESTIONS FOR A1 -> B2)
// ==========================================
export const seedPlacementQuestions: PlacementQuestion[] = [
  {
    id: 'pt-1',
    questionEn: 'Choose the best greeting when a customer enters your restaurant at 7:00 PM:',
    questionVi: 'Chọn lời chào thích hợp nhất khi khách bước vào quán lúc 7 giờ tối:',
    options: ['Good night!', 'Good evening! Welcome to our restaurant.', 'What do you eat?', 'Hello, who are you?'],
    correctIndex: 1,
    level: 'A1',
    explanationVi: '"Good evening" là lời chào chuẩn sau 6 giờ chiều. "Good night" chỉ dùng khi đi ngủ hoặc chào tạm biệt ra về.'
  },
  {
    id: 'pt-2',
    questionEn: '"Table for two, please." - What should the waiter reply?',
    questionVi: '"Cho tôi một bàn hai người." - Phục vụ nên đáp lại thế nào?',
    options: [
      'Right this way, please.',
      'No way!',
      'Why two people?',
      'You sit somewhere.'
    ],
    correctIndex: 0,
    level: 'A1',
    explanationVi: '"Right this way, please" là câu hướng dẫn dẫn khách chuẩn mực và lịch sự.'
  },
  {
    id: 'pt-3',
    questionEn: 'Which word describes a beverage that has NO alcohol?',
    questionVi: 'Từ nào miêu tả đồ uống HOÀN TOÀN KHÔNG CỒN?',
    options: ['Spirits', 'Non-alcoholic / Virgin', 'Neat', 'High-proof'],
    correctIndex: 1,
    level: 'A1',
    explanationVi: '"Non-alcoholic" hoặc "Virgin" dùng cho cocktail/đồ uống không chứa cồn.'
  },
  {
    id: 'pt-4',
    questionEn: 'A guest wants their steak cooked with a warm pink center and juicy texture. How should they order it?',
    questionVi: 'Khách muốn miếng bò bít tết có lõi hồng ấm và mọng nước. Họ nên chọn độ chín nào?',
    options: ['Well-done', 'Blue rare', 'Medium-rare', 'Burnt'],
    correctIndex: 2,
    level: 'A1',
    explanationVi: 'Medium-rare là độ chín đạt chuẩn lõi hồng mọng nước.'
  },
  {
    id: 'pt-5',
    questionEn: 'What does "on the house" mean?',
    questionVi: 'Cụm từ "on the house" có nghĩa là gì trong nhà hàng?',
    options: ['Served on the roof of the building', 'Free of charge, provided by the restaurant', 'Expensive dish', 'Guests must take it home'],
    correctIndex: 1,
    level: 'A2',
    explanationVi: '"On the house" đồng nghĩa với "complimentary" - nhà hàng tặng miễn phí cho khách.'
  },
  {
    id: 'pt-6',
    questionEn: 'Fill in the blank: "Would you like your single malt whiskey neat or _______ the rocks?"',
    questionVi: 'Điền từ còn thiếu: "Would you like your single malt whiskey neat or _______ the rocks?"',
    options: ['in', 'at', 'on', 'with'],
    correctIndex: 2,
    level: 'A2',
    explanationVi: 'Cụm từ cố định là "on the rocks" (uống với đá).'
  },
  {
    id: 'pt-7',
    questionEn: 'If a diner has Celiac disease, which ingredient must they strictly avoid?',
    questionVi: 'Nếu thực khách mắc bệnh Celiac, họ phải kiêng tuyệt đối chất nào?',
    options: ['Water', 'Gluten (wheat, barley)', 'Salt', 'Pure fruit juice'],
    correctIndex: 1,
    level: 'A2',
    explanationVi: 'Người mắc bệnh Celiac không thể tiêu hóa gluten có trong lúa mì và lúa mạch.'
  },
  {
    id: 'pt-8',
    questionEn: 'A guest finds a hair in their soup. What is the FIRST thing you should do?',
    questionVi: 'Khách thấy có sợi tóc trong chén súp. Điều ĐẦU TIÊN bạn nên làm là gì?',
    options: [
      'Argue that the hair belongs to the guest',
      'Apologize sincerely and remove the bowl to replace it with a fresh one immediately',
      'Tell them to remove the hair and keep eating',
      'Ignore them and walk away'
    ],
    correctIndex: 1,
    level: 'A2',
    explanationVi: 'Luôn xin lỗi ngay và đổi món mới nóng sốt sạch sẽ để bảo vệ uy tín nhà hàng.'
  },
  {
    id: 'pt-9',
    questionEn: 'What is the term for having all ingredients chopped, measured, and prepped before the dinner rush begins?',
    questionVi: 'Thuật ngữ chỉ việc chuẩn bị, cắt thái sẵn sàng nguyên liệu trước khi ca bếp bắt đầu là gì?',
    options: ['Mise en place', 'À la carte', 'Table d\'hôte', 'Sous vide'],
    correctIndex: 0,
    level: 'B1',
    explanationVi: '"Mise en place" là thuật ngữ tiếng Pháp kinh điển của ngành ẩm thực.'
  },
  {
    id: 'pt-10',
    questionEn: 'Which milk alternative produces the silkiest microfoam and least alters the coffee\'s subtle flavors?',
    questionVi: 'Loại sữa thực vật nào tạo bọt microfoam mịn nhất và ít lấn át vị cà phê nhất?',
    options: ['Soy milk', 'Coconut milk', 'Oat milk (barista edition)', 'Rice water'],
    correctIndex: 2,
    level: 'B1',
    explanationVi: 'Oat milk (sữa yến mạch) là loại sữa thực vật được các barista ưa chuộng nhất hiện nay.'
  },
  {
    id: 'pt-11',
    questionEn: 'In high-end dining, what is the role of an "Expediter" (Expo)?',
    questionVi: 'Trong nhà hàng cao cấp, vai trò của "Expediter" là gì?',
    options: [
      'Washing dishes in the scullery',
      'Coordinating between kitchen and floor, inspecting plates for quality before they leave the pass',
      'Mixing cocktails behind the bar',
      'Driving the supply truck'
    ],
    correctIndex: 1,
    level: 'B1',
    explanationVi: 'Expo là cầu nối đảm bảo từng đĩa thức ăn đúng order và hoàn hảo trước khi bưng ra cho khách.'
  },
  {
    id: 'pt-12',
    questionEn: 'What does "86" signify in kitchen communication?',
    questionVi: '"86" biểu thị điều gì trong trao đổi giữa bếp và phục vụ?',
    options: ['Item is out of stock / sold out', 'Cook it for 86 seconds', 'Discount by 86 percent', 'Call table 86'],
    correctIndex: 0,
    level: 'B1',
    explanationVi: '"86" nghĩa là món ăn đã hết hàng hoàn toàn trong ca làm việc.'
  },
  {
    id: 'pt-13',
    questionEn: 'Which cocktail preparation method preserves crystal-clear clarity for spirit-forward cocktails like Negroni or Manhattan?',
    questionVi: 'Phương pháp nào giữ độ trong suốt cho các loại cocktail nhiều cồn như Negroni hay Manhattan?',
    options: ['Stirring with ice in a mixing glass', 'Shaking in a metal shaker', 'Blending with crushed ice', 'Microwaving'],
    correctIndex: 0,
    level: 'B2',
    explanationVi: 'Khuấy (stirring) làm lạnh đều mà không làm vỡ bọt khí làm đục màu rượu.'
  },
  {
    id: 'pt-14',
    questionEn: 'What does HACCP stand for in international food safety standards?',
    questionVi: 'Chữ viết tắt HACCP trong tiêu chuẩn an toàn thực phẩm quốc tế có nghĩa là gì?',
    options: [
      'Hazard Analysis Critical Control Point',
      'Hotel And Catering Clean Protocol',
      'Heat Applied Cooking Control Process',
      'Hygiene And Clean Cut Produce'
    ],
    correctIndex: 0,
    level: 'B2',
    explanationVi: 'HACCP là hệ thống quản lý an toàn thực phẩm mang tính phòng ngừa quốc tế.'
  },
  {
    id: 'pt-15',
    questionEn: 'How should you professionally refuse service to an intoxicated customer without causing a scene?',
    questionVi: 'Cách chuyên nghiệp nhất để từ chối phục vụ thêm rượu cho khách đã quá chén là gì?',
    options: [
      'Shout that they are too drunk to drink',
      'Politely offer water or coffee and quietly state that company policy prevents serving further alcohol',
      'Call the police immediately',
      'Pour them tap water and charge for whiskey'
    ],
    correctIndex: 1,
    level: 'B2',
    explanationVi: 'Bảo vệ khách và nhà hàng một cách khéo léo, nhã nhặn bằng chính sách quán và mời nước/cà phê giải rượu.'
  }
];

// ==========================================
// 9. MENU TRANSLATOR & DISH BUILDER DATA
// ==========================================
export interface MenuTranslatorItem {
  vietnameseName: string;
  recommendedEnglishName: string;
  category: 'dish' | 'drink' | 'dessert';
  keyIngredients: string[];
  cookingMethod: string;
  flavorProfile: string;
  potentialAllergens: string[];
  staffDescriptionScript: string;
}

export const seedMenuTranslator: MenuTranslatorItem[] = [
  {
    vietnameseName: 'Phở bò tái nạm',
    recommendedEnglishName: 'Traditional Beef Pho (Sliced Rare Beef & Brisket)',
    category: 'dish',
    keyIngredients: ['Flat rice noodles', 'Slow-simmered beef bone broth', 'Thinly sliced rare beef', 'Tender brisket', 'Star anise', 'Cinnamon', 'Fresh herbs'],
    cookingMethod: 'Simmered for 12 hours with roasted aromatic spices',
    flavorProfile: 'Rich, aromatic, subtly sweet and herb-infused',
    potentialAllergens: ['Fish sauce (anchovies)'],
    staffDescriptionScript: 'Our Pho features flat rice noodles in a rich beef broth simmered for 12 hours with star anise and cinnamon, topped with tender brisket and thinly sliced rare beef that finishes cooking right in your piping-hot bowl.'
  },
  {
    vietnameseName: 'Bún chả Hà Nội',
    recommendedEnglishName: 'Hanoi Char-grilled Pork Patties with Rice Vermicelli',
    category: 'dish',
    keyIngredients: ['Char-grilled pork patties', 'Sliced pork belly', 'Rice vermicelli', 'Warm dipping broth (fish sauce, green papaya)', 'Fresh herbs'],
    cookingMethod: 'Char-grilled over natural charcoal',
    flavorProfile: 'Smoky, savory, sweet and tangy dipping broth',
    potentialAllergens: ['Fish sauce'],
    staffDescriptionScript: 'A Hanoi specialty consisting of fragrant pork patties char-grilled over hot coals, served with delicate rice vermicelli and fresh herbs in a warm sweet-and-sour dipping broth with green papaya.'
  },
  {
    vietnameseName: 'Cà phê muối Huế',
    recommendedEnglishName: 'Salted Caramel Foam Iced Coffee',
    category: 'drink',
    keyIngredients: ['Vietnamese robusta drip coffee', 'Condensed milk', 'Sea salt whipped cream foam', 'Ice'],
    cookingMethod: 'Slow drip phin filter and whipped salted cream layer',
    flavorProfile: 'Bold, creamy sweet with a delightful savory sea salt contrast',
    potentialAllergens: ['Dairy (condensed milk, cream)'],
    staffDescriptionScript: 'A trendy Hue signature coffee featuring traditional slow-dripped robusta sweetened with condensed milk, topped with a velvety, savory sea-salt cream foam that balances the deep chocolatey bitterness.'
  },
  {
    vietnameseName: 'Cà phê trứng Hà Nội',
    recommendedEnglishName: 'Hanoi Egg Cream Coffee',
    category: 'drink',
    keyIngredients: ['Dark drip coffee', 'Whipped egg yolk', 'Condensed milk', 'Vanilla touch'],
    cookingMethod: 'Fresh egg yolks whipped to a custard fluff over hot black coffee',
    flavorProfile: 'Rich, custard-like, sweet, like a liquid tiramisu',
    potentialAllergens: ['Egg', 'Dairy'],
    staffDescriptionScript: 'Often described as Vietnam\'s liquid tiramisu: intense hot black coffee crowned with a luscious, whipped sweet egg yolk custard foam.'
  },
  {
    vietnameseName: 'Gỏi cuốn tôm thịt',
    recommendedEnglishName: 'Fresh Summer Rolls with Shrimp & Pork',
    category: 'dish',
    keyIngredients: ['Rice paper', 'Poached shrimp', 'Pork tenderloin', 'Rice vermicelli', 'Fresh mint', 'Coriander'],
    cookingMethod: 'Assembled fresh, served un-fried with hoisin peanut dip',
    flavorProfile: 'Fresh, crisp, light and herbaceous',
    potentialAllergens: ['Peanuts (in dipping sauce)', 'Shellfish (shrimp)'],
    staffDescriptionScript: 'Delicate translucent rice paper hand-rolled with crisp lettuce, fresh mint, tender poached pork, and sweet tiger prawns, paired with our savory roasted peanut dipping sauce.'
  },
  {
    vietnameseName: 'Bánh mì thịt nướng pate',
    recommendedEnglishName: 'Vietnamese Baguette with Grilled Pork & Liver Pâté',
    category: 'dish',
    keyIngredients: ['Crispy warm baguette', 'Savory liver pâté', 'Char-grilled lemongrass pork', 'Pickled daikon & carrot', 'Cucumber', 'Cilantro'],
    cookingMethod: 'Toasted crisp with hot grilled filling',
    flavorProfile: 'Crispy exterior, savory, rich, balanced by crunchy tangy pickles',
    potentialAllergens: ['Gluten (wheat baguette)', 'Pork'],
    staffDescriptionScript: 'A world-famous crusty baguette packed with rich pork liver pâté, succulent lemongrass-grilled pork, crunchy pickled carrots, fresh cucumber, and aromatic coriander.'
  }
];
