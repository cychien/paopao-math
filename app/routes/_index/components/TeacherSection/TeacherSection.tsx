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
            src="https://res.cloudinary.com/dgppby8lr/image/upload/w_1650,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg"
            loading="eager"
            aspectRatioClassName="aspect-[calc(2304/1927)]"
            blurDataUri="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAAGNbWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAsaWxvYwAAAABEAAACAAEAAAABAAACMQAAAk4AAgAAAAEAAAG1AAAAfAAAAEJpaW5mAAAAAAACAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAAAaaW5mZQIAAAAAAgAAYXYwMUFscGhhAAAAABppcmVmAAAAAAAAAA5hdXhsAAIAAQABAAAAw2lwcnAAAACdaXBjbwAAABRpc3BlAAAAAAAAARgAAADqAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgSAAAAAAABNjb2xybmNseAACAAIAAYAAAAAOcGl4aQAAAAABCAAAAAxhdjFDgQAcAAAAADhhdXhDAAAAAHVybjptcGVnOm1wZWdCOmNpY3A6c3lzdGVtczphdXhpbGlhcnk6YWxwaGEAAAAAHmlwbWEAAAAAAAAAAgABBAECgwQAAgQBBYYHAAAC0m1kYXQSAAoGGCHi/SwqMnBEaAGGFNgFmHl8EYFmsE3xzC18dSMwEI31GISiV6Pxq0OTTBtj0Jx1pDnW364LxGsLlaAhCmn++o/B3NeKqKtvJm96u+kinxcXIvn0yaY+wwEzKvIeCXanPtZb+5poCVLl0FTYUk8ucD/eYpvDduAgEgAKCTgh4v0sIEBAMjK+BBGgAYYYYQC1R7he9RxT3g97JbahHSGXI9GUoM4FeTtwab/G1lU+N1Bf3VApmeMT49vbP7nqR+pwBD+jajXwCC5+KiYhcoQquvVw3nQfydNEexDnIBI0mXiMXLQQjCnuDULQC5eDrMzsMPsObOVQsn6XpOglu2u+CSH/gCI1vUj75PJIjil2IzdVAFS1JtjTmyF2wnlCHeB5ouV3qgJsLTj4Tmhe+RYohVFMDW8JW/8Y6Nvp9w14RhyirLXfLgZbCAayuWQIJ7Hh4jdYvlknYqk7ii0CyuG4wo8uWauDCqU7oKSNQJr1iww0ea1wRj2PFji+tugvBdWsjWSF3Tbox9InDNqyaRWQAVEMdfAmo8O/SG1u5BTfcvyG0Pk1fhDp4oBSPz2o4WE+d76aAHkzm+Yapt3LbkDOgIaoSBtSH9utEyn1YotptpGRq12PNAVf/wOkUxmVA0GDGZg+/OvXZyd6OP/69/EP46yLdx6Ve1e5cFIgFauxUjfi+NiEsPBYuPvQJoXPZUB5zzLZVkhMCSbeQsRHgUXOk0D5qmQXm8KNmQOgvww0Q7lbub3gH9tlyyXaztV4iWlOP0yfFT77JaTJiO1MfsviWtBNHLiMgjaCSlJHy6+Lkk8GJqSn+uoQKhqVbwjk9hwnXdjIE7wX4ZSHwwGxFB56r77MU5srHenDMep1eao8WLawVL4bAM+6EG4qTk5wM9et4PhHxHnFVnkzCCTPFpcXLVwxMwEvWhut70ium9pFri/PPhzT0qU="
            className="rounded-[10px]"
            srcSet="
              https://res.cloudinary.com/dgppby8lr/image/upload/w_280,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg 280w,
              https://res.cloudinary.com/dgppby8lr/image/upload/w_560,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg 560w,
              https://res.cloudinary.com/dgppby8lr/image/upload/w_840,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg 840w,
              https://res.cloudinary.com/dgppby8lr/image/upload/w_1100,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg 1100w,
              https://res.cloudinary.com/dgppby8lr/image/upload/w_1650,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg 1650w,
              https://res.cloudinary.com/dgppby8lr/image/upload/w_2100,q_auto,f_auto,e_sharpen/v1746455426/paopao/paopao_jz9i86.jpg 2100w,
            "
            sizes="(min-width:640px) 100%, 100%"
          />
        </div>
      </div>
    </section>
  );
}

export { TeacherSection };
