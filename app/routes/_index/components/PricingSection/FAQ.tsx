import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>課程什麼時候開？</AccordionTrigger>
        <AccordionContent>
          課程預計在 <span className="font-semibold">7 月中旬</span>{" "}
          正式上線，一開課我們就會第一時間通知你，確保你不會錯過
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>購買後可以退款嗎？</AccordionTrigger>
        <AccordionContent>
          可以的，購買後 7 日內皆可申請全額退款，無需提供任何理由
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>未來還會新增影片與題庫嗎？</AccordionTrigger>
        <AccordionContent>
          會的！我們會持續更新課程內容，並不定期新增影片與題庫
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>可以離線觀看課程嗎？</AccordionTrigger>
        <AccordionContent>
          目前不支援離線觀看課程，未來會考慮加入此功能
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>遇到技術或學習問題怎麼辦？</AccordionTrigger>
        <AccordionContent>
          遇到任何問題都可以在內部的「精選試題頁」中發問
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>可以與同學共用課程嗎？</AccordionTrigger>
        <AccordionContent>
          不可以！課程內容僅限購買者本人使用，請勿與他人共用帳號
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export { FAQ };
