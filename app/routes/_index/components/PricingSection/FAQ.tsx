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
          預計於 <span className="font-semibold">7 月中旬</span>{" "}
          正式開課，隨時可前往{" "}
          <span className="font-semibold underline">課程製作進度</span>{" "}
          頁面查看最新進度
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>購買後可以退款嗎？</AccordionTrigger>
        <AccordionContent>
          目前不提供退款服務，請在購買前確認是否有興趣學習本課程
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
          遇到任何問題都可以在「課程討論區」發問，或是加入我們的 Discord
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
