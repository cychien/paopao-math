import * as React from "react";
import { cn } from "~/utils/style";

/**
 * This component is very opinionated. It requests you to provide more props than
 * it normally should to become a performant image.
 */

interface ImageProps extends React.ComponentPropsWithoutRef<"img"> {
  /*
   srcSet & sizes are required to load responsive image
   srcSet example:
   "
      https://res.cloudinary.com/dgppby8lr/image/upload/w_280,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 280w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_560,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 560w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_840,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 840w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_1100,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 1100w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_1650,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 1650w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_2100,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 2100w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_2500,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 2500w,
      https://res.cloudinary.com/dgppby8lr/image/upload/w_3100,q_auto,f_auto/v1693572221/cotton-ui/image-component-demo_rllwr6.jpg 3100w
    "
  */
  srcSet: string;
  sizes: string; // sizes exmaple: "(min-width:640px) 330px, 80vw"
  aspectRatioClassName: string; // Prevent layout shift
  bgColorClassName?: string; // The color you will see when image is loading and no blurDataUri provided
  blurDataUri?: string; // If this value isn't set, no blur effect will be applied
}

function Image({
  loading = "lazy", // Default to lazy, but can be changed
  aspectRatioClassName,
  bgColorClassName = "bg-gray-200",
  blurDataUri,
  className,
  ...imgRestProps
}: ImageProps) {
  const [visible, setVisible] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      setVisible(true);
      return;
    }

    const handleLoad = () => {
      // Prevent setState after image unmounts
      if (!imgRef.current) return;
      // Put setVisible to next frame
      setTimeout(() => setVisible(true), 0);
    };

    el.addEventListener("load", handleLoad);

    return () => {
      el.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className={cn(aspectRatioClassName, "relative")}>
      <div className={cn(bgColorClassName, className, "absolute inset-0")} />
      {blurDataUri ? (
        <>
          <img
            src={blurDataUri}
            className={cn(className, "absolute inset-0 w-full")}
            alt={imgRestProps.alt}
          />
          <div
            className={cn(
              className,
              "absolute backdrop-blur-xl w-full inset-0"
            )}
          />
        </>
      ) : null}
      <img
        ref={imgRef}
        alt={imgRestProps.alt}
        className={cn(className, "absolute inset-0 transition-opacity w-full", {
          "opacity-0": !visible,
        })}
        {...imgRestProps}
        /*
          If image is already in cache, onload event might trigger fast and 
          even before hydration, so we put event handler inline to run as soon 
          as possible
        */
        // onload="this.classList.remove('opacity-0')"
        loading={loading}
      />
      <noscript>
        <img alt={imgRestProps.alt} className={className} {...imgRestProps} />
      </noscript>
    </div>
  );
}

export { Image };
