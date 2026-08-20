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
