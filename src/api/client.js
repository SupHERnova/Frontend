// 백엔드 스웨거: http://34.64.181.69/swagger-ui/index.html
// 개발 중엔 CORS 우회를 위해 vite.config.js의 /api 프록시를 거쳐 요청한다.

// TODO: 매장별로 로그인/컨텍스트가 생기면 하드코딩을 제거한다.
export const STORE_ID = 101;

async function request(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.isSuccess) {
    throw new Error(body?.message || `요청에 실패했어요 (${res.status})`);
  }

  return body.result;
}

export function fetchCustomers({ storeId = STORE_ID, search = "", page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  if (search) params.set("search", search);
  return request(`/stores/${storeId}/customers?${params.toString()}`);
}

export function fetchCustomerDetail(customerId) {
  return request(`/customers/${customerId}`);
}

export function fetchCustomerBriefings(customerId) {
  return request(`/customers/${customerId}/briefings`);
}

export function fetchBriefingContext(customerId) {
  return request(`/customers/${customerId}/briefings/context`);
}

export function generateBriefing(customerId, transcribedText) {
  return request(`/customers/${customerId}/briefings/generate`, {
    method: "POST",
    body: JSON.stringify({ transcribedText }),
  });
}

export function fetchBriefingById(briefingId) {
  return request(`/briefings/${briefingId}`);
}

export function fetchRecommendation(customerId) {
  return request(`/customers/${customerId}/recommendations`);
}

export function createRecord(customerId, rawNote) {
  return request(`/customers/${customerId}/records`, {
    method: "POST",
    body: JSON.stringify({ rawNote }),
  });
}
