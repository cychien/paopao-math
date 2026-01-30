import * as React from "react";
import { cn } from "~/utils/style";

type ImageProvider = "cloudflare" | "cloudinary";

interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  imageId: string;
  alt: string;
  aspectRatio?: number; // width/height ratio, e.g., 16/9, 4/3
  sizes?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean; // for eager loading
  imgClassName?: string;
  provider?: ImageProvider; // "cloudflare" or "cloudinary"
}

// Fixed Cloudflare Images variants
const VARIANTS = [
  "280x",
  "560x",
  "840x",
  "1100x",
  "1650x",
  "2100x",
  "2500x",
  "3100x",
] as const;
const VARIANT_WIDTHS = [280, 560, 840, 1100, 1650, 2100, 2500, 3100] as const;

// Default sizes attribute
const DEFAULT_SIZES = "100vw";
const CLOUDFLARE_ACCOUNT_HASH = "SPWOCrxVSg9biPa11mIZYA";
const CLOUDINARY_CLOUD_NAME = "dgppby8lr";

function buildCloudflareImageUrl(
  imageId: string,
  variant: string = "public"
): string {
  // return `https://app.minutesite.app/cdn-cgi/imagedelivery/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`;
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`;
}

function buildCloudinaryImageUrl(
  imageId: string,
  width?: number,
  transformations: string = "q_auto,f_auto,e_sharpen"
): string {
  const widthParam = width ? `w_${width},` : "";
  // Fixed format: https://res.cloudinary.com/dgppby8lr/image/upload/w_1650,q_auto,f_auto,e_sharpen/v1746455426/paopao/{imageId}
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${widthParam}${transformations}/v1746455426/paopao/${imageId}`;
}

function generateCloudinarySrcSet(imageId: string): string {
  return VARIANT_WIDTHS.map((width) => {
    const url = buildCloudinaryImageUrl(imageId, width);
    return `${url} ${width}w`;
  }).join(", ");
}

function generateCloudflareSrcSet(imageId: string): string {
  return VARIANTS.map((variant, index) => {
    const url = buildCloudflareImageUrl(imageId, variant);
    const width = VARIANT_WIDTHS[index];
    return `${url} ${width}w`;
  }).join(", ");
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      imageId,
      alt,
      aspectRatio,
      sizes = DEFAULT_SIZES,
      objectFit,
      priority = false,
      className,
      style,
      imgClassName,
      provider = "cloudflare",
      ...props
    },
    ref
  ) => {
    // Generate srcSet and src based on provider
    const srcSet =
      provider === "cloudinary"
        ? generateCloudinarySrcSet(imageId)
        : generateCloudflareSrcSet(imageId);

    const src =
      provider === "cloudinary"
        ? buildCloudinaryImageUrl(imageId, 3100)
        : buildCloudflareImageUrl(imageId, "3100x");

    // Container styles for aspect ratio
    const containerStyle: React.CSSProperties = {
      ...style,
      ...(aspectRatio && {
        aspectRatio: aspectRatio.toString(),
        overflow: "hidden",
      }),
    };

    // Image styles
    const imageStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      ...(objectFit && { objectFit }),
    };

    const imageElement = (
      <img
        ref={ref}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="auto"
        style={imageStyle}
        className={cn("bg-gray-50", imgClassName)}
        {...props}
      />
    );

    return (
      <div
        className={cn("relative overflow-hidden bg-gray-50", className)}
        style={containerStyle}
      >
        {imageElement}
      </div>
    );
  }
);

Image.displayName = "Image";

export { Image, type ImageProps };
