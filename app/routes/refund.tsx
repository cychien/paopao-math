import { PolicyLayout } from "~/components/layout/PolicyLayout";

export const meta = () => {
  return [{ title: "退款政策 | 寶哥高中數學" }];
};

export default function RefundPolicy() {
  return (
    <PolicyLayout title="退款政策">
      <p className="mb-4">本退款政策適用於寶哥高中數學網站所販售之線上課程/數位內容（以下稱「本服務」）。</p>
      <ol className="list-decimal pl-5 space-y-4">
        <li>
          <strong>退款期限</strong>：自完成付款之日起 7 天內可提出退款申請。
        </li>
        <li>
          <strong>退款條件</strong>：申請時若課程觀看進度未超過 20%，且未大量下載/散佈教材，得申請退款。
        </li>
        <li>
          <strong>不予退款</strong>：若已超過期限、觀看進度超過門檻、或已提供客製化服務/檔案交付，恕不退款。
        </li>
        <li>
          <strong>退費方式</strong>：退款將原路退回至原付款方式；若產生金流/匯款手續費，可能自退款金額中扣除。
        </li>
        <li>
          <strong>申請方式</strong>：請來信（或填寫表單）提供訂單編號、購買人姓名、聯絡方式與退款原因。
        </li>
        <li>
          <strong>處理時間</strong>：收到申請後 3–7 個工作天完成審核；實際入帳時間依銀行/發卡機構為準。
        </li>
        <li>
          <strong>權限處理</strong>：退款完成後，本服務之帳號使用權限將被取消。
        </li>
        <li>
          <strong>政策變更</strong>：本網站保留隨時修改本政策之權利，並以網站公告為準。
        </li>
        <li>
          <strong>其他</strong>：如有爭議，以本網站所在地之法律與管轄法院為準。
        </li>
      </ol>
    </PolicyLayout>
  );
}
