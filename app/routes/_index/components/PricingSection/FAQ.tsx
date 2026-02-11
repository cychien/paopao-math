import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

const faqItems = [
  {
    question: "課程什麼時候開？",
    answer: "課程預計在 3 月中旬正式上線，現在已開放購買與搶先觀看部分內容，你可以提前開始學習；完整課程內容將於正式上線時釋出。",
  },
  {
    question: "購買後可以退款嗎？",
    answer: "可以的，購買後 7 日內皆可申請全額退款，無需提供任何理由。",
  },
  {
    question: "未來還會新增影片與題庫嗎？",
    answer: "會的！我們會持續更新課程內容，並不定期新增影片與題庫。",
  },
  // {
  //   question: "可以離線觀看課程嗎？",
  //   answer: "目前不支援離線觀看課程，未來會考慮加入此功能。",
  // },
  {
    question: "遇到技術或學習問題怎麼辦？",
    answer: "如果在學習過程中遇到任何技術問題或理解上的困難，都歡迎隨時來信與我們聯繫，我們會盡快回覆。客服信箱：paopaomath@gmail.com",
  },
  {
    question: "可以與同學共用課程嗎？",
    answer: "不可以！課程內容僅限購買者本人使用，請勿與他人共用帳號。",
  },
];

function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full divide-y divide-gray-200">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger className="text-left text-gray-900 hover:text-brand-600 hover:no-underline font-medium">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export { FAQ };
