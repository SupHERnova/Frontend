import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/common/BackButton";
import RecordCard from "../components/record/RecordCard";
import RecordEditor from "../components/record/RecordEditor";
import {
  customers,
  getCustomerById,
  getRecordsByCustomerId,
  records,
} from "../data/mockCustomers";

function RecordListView() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pb-[110px] pt-8">
      <h1 className="text-center text-[15px] font-semibold text-ink">기록</h1>

      <section className="mt-6">
        <p className="mb-2 text-[13px] font-medium text-muted">
          새 기록 작성
        </p>
        <div className="flex gap-2 overflow-x-auto">
          {customers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => navigate(`/record/${customer.id}`)}
              className="shrink-0 rounded-full border border-line px-4 py-2 text-[13px] font-medium text-ink active:bg-line/40"
            >
              {customer.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-2">
        <p className="mb-1 text-[13px] font-medium text-muted">최근 기록</p>
        {records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onClick={() => navigate(`/record/${record.customerId}`)}
          />
        ))}
      </section>
    </div>
  );
}

function RecordDetailView({ customerId }) {
  const navigate = useNavigate();
  const customer = getCustomerById(customerId);
  const pastRecords = getRecordsByCustomerId(customerId);

  if (!customer) {
    return (
      <div className="px-5 pb-[110px] pt-8">
        <BackButton onClick={() => navigate("/record")} label="뒤로" />
        <p className="mt-6 text-[14px] text-muted">
          고객 정보를 찾을 수 없어요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-col px-5 pb-[110px] pt-8">
      <div className="mb-5 flex items-center gap-3">
        <BackButton onClick={() => navigate("/record")} />
        <h1 className="text-[15px] font-semibold text-ink">
          {customer.name} 고객님
        </h1>
      </div>

      <RecordEditor
        pastRecords={pastRecords}
        onSave={(content) => {
          // TODO: 백엔드 API 연동 시 실제 저장 요청으로 교체
          console.log("save record", { customerId, content });
        }}
      />
    </div>
  );
}

function RecordPage() {
  const { customerId } = useParams();

  return customerId ? (
    <RecordDetailView customerId={customerId} />
  ) : (
    <RecordListView />
  );
}

export default RecordPage;
