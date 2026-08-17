// TODO: 백엔드 API 스펙이 확정되면 이 파일을 fetch 기반 호출로 교체한다.
// 아래 모양(customers 배열의 필드 구조)이 곧 프론트가 기대하는 데이터 계약이다.

export const BADGE_LABEL = {
  restock: "재입고",
  match: "고일치",
};

export const contactStats = {
  readyCount: 5,
  breakdown: [
    { label: "재입고 상품", count: 2 },
    { label: "고일치 상품", count: 3 },
  ],
};

export const customers = [
  {
    id: "c1",
    name: "이수정",
    gender: "여성",
    age: 41,
    lastVisitDays: 22,
    badge: "restock",
    styleTags: ["클래식", "뉴트럴"],
    lastContact: "3일 전",
    pitch: {
      topNote: "이전 문의 상품 재입고",
      productName: "NOIR 소프트 로퍼 · 240",
      bottomNote: "오늘 2개 재입고",
    },
    recommendedProducts: [
      {
        id: "p1",
        name: "NOIR 소프트 로퍼",
        size: "240",
        price: 890000,
        matchRate: 95,
      },
      {
        id: "p2",
        name: "오브 숄더백",
        size: "FREE",
        price: 1540000,
        matchRate: 80,
      },
    ],
    similarCustomers: {
      topSearchedItem: "슬림 로퍼",
      items: [
        { name: "슬림 로퍼", percent: 83 },
        { name: "마니 슬리퍼", percent: 62 },
      ],
    },
    openingLine:
      "지난번 문의하신 블랙 로퍼가 오늘 입고됐습니다. 평소 좋아하시는 미니멀한 스타일과 잘 맞는 신상품도 함께 보여드리겠습니다.",
  },
  {
    id: "c2",
    name: "김서윤",
    gender: "여성",
    age: 34,
    lastVisitDays: 18,
    badge: "restock",
    styleTags: ["미니멀", "블랙", "가족"],
    lastContact: "5분 전",
    pitch: {
      topNote: "이전 문의 상품 재입고",
      productName: "NOIR 소프트 로퍼 · 240",
      bottomNote: "오늘 2개 재입고",
    },
    recommendedProducts: [
      {
        id: "p1",
        name: "NOIR 소프트 로퍼",
        size: "240",
        price: 890000,
        matchRate: 95,
      },
      {
        id: "p2",
        name: "오브 숄더백",
        size: "FREE",
        price: 1540000,
        matchRate: 80,
      },
    ],
    similarCustomers: {
      topSearchedItem: "슬림 로퍼",
      items: [
        { name: "슬림 로퍼", percent: 83 },
        { name: "마니 슬리퍼", percent: 62 },
      ],
    },
    openingLine:
      "지난번 문의하신 블랙 로퍼가 오늘 입고됐습니다. 평소 좋아하시는 미니멀한 스타일과 잘 맞는 신상품도 함께 보여드리겠습니다.",
  },
  {
    id: "c3",
    name: "홍길동",
    gender: "남성",
    age: 38,
    lastVisitDays: 10,
    badge: "match",
    styleTags: ["클래식", "뉴트럴"],
    lastContact: "1시간 전",
    pitch: {
      topNote: "취향 고일치 상품",
      productName: "테라 스웨이드 부츠 · 270",
      bottomNote: "직전 방문 시 착용",
    },
    recommendedProducts: [],
    similarCustomers: {
      topSearchedItem: null,
      items: [],
    },
    openingLine:
      "지난번 문의하신 부츠 오퍼가 오늘 입고되었습니다. 편하신 시간에 매장으로 안내드리겠습니다.",
  },
];

export function getCustomerById(customerId) {
  return customers.find((customer) => customer.id === customerId) ?? null;
}

export const records = [
  {
    id: "r1",
    customerId: "c1",
    customerName: "이수정",
    date: "2026-08-15",
    status: "작성완료",
    summary: "로퍼 사이즈 재고 문의, 240 재입고 시 연락 요청",
  },
  {
    id: "r2",
    customerId: "c2",
    customerName: "김서윤",
    date: "2026-08-14",
    status: "작성완료",
    summary: "뉴트럴 톤 신상품 관심, 다음 주 방문 예정",
  },
  {
    id: "r3",
    customerId: "c3",
    customerName: "홍길동",
    date: "2026-08-12",
    status: "임시저장",
    summary: "부츠 착용 후 편안함 언급, 추가 상담 필요",
  },
];

export function getRecordsByCustomerId(customerId) {
  return records.filter((record) => record.customerId === customerId);
}
