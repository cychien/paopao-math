import { Image } from "~/components/ui/image";

function TeacherSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto lg:flex lg:flex-row-reverse lg:gap-16">
        <div className="flex-1">
          <h3 className="font-semibold text-text-brand-secondary text-sm lg:text-base">
            你的老師
          </h3>
          <div className="mt-3 text-3xl lg:text-4xl font-semibold">
            錢寶明 (寶哥)
          </div>
          <div className="mt-12 mb-8 h-px bg-border-secondary" />
          <div className="text-text-tertiary space-y-4 lg:text-lg lg:space-y-5 xl:space-y-6">
            <p>
              我是一位高中數學老師，擁有超過 30
              年的高中數學教學經驗，深知學生學習的節奏與需求。
            </p>
            <p>
              曾參與多本高中數學總複習教材、單元輔導講義的編寫，並負責各式段考、學測模擬試題的命題與審題工作，充分掌握大考趨勢。
            </p>
            <p>
              我的教學風格紮實細膩，重視基礎觀念的建立，循序漸進地引導學生掌握數學核心能力。
            </p>
            <p>
              這堂課，濃縮了我 30+
              年來的教學經驗與解題心法，希望在你準備學測的關鍵時刻，成為真正幫得上忙的那一份教材。
            </p>
          </div>
        </div>
        <div className="flex-1 mt-12 lg:mt-0">
          <Image
            alt="你的老師"
            imageId="paopao_jz9i86.jpg"
            provider="cloudinary"
            priority
            aspectRatio={2304 / 1927}
            className="rounded-[10px]"
            sizes="(min-width:640px) 100%, 100%"
          />
        </div>
      </div>
    </section>
  );
}

export { TeacherSection };
