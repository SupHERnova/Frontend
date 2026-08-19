import { useEffect, useState } from "react";

import { fetchCustomers } from "../api/client";
import { daysAgo } from "../utils/date";

function mapCustomer(raw) {
  return {
    id: raw.customerId,
    name: raw.customerName,
    grade: raw.grade,
    gender: raw.gender,
    age: raw.age,
    lastVisitDays: daysAgo(raw.lastVisitAt),
    recommendationType: raw.recommendationType,
    styleTags: [...new Set(raw.keywords ?? [])],
  };
}

export function useCustomerList(search) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const debounceId = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetchCustomers({ search })
        .then((result) => {
          if (cancelled) return;
          setCustomers(result.content.map(mapCustomer));
        })
        .catch((err) => {
          if (!cancelled) setError(err.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(debounceId);
    };
  }, [search]);

  return { customers, loading, error };
}
