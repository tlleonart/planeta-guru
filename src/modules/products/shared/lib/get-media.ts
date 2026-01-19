import type { Media } from "@/modules/shared/types/product-types";

const getMediaByDevice = (
  media: Media[],
  mediaTypeId: number,
  device: string,
): string => {
  if (!media) {
    return "/placeholder.svg";
  }

  const foundMedia = media.find((img) => {
    if (img.mediaTypeId !== mediaTypeId) {
      return false;
    }

    const url = img.url.toLowerCase();
    const description = img.description?.toLowerCase() || "";

    if (device === "mobile") {
      return url.includes("mobile") || description.includes("mobile");
    }

    if (device === "desktop") {
      return (
        url.includes("desktop") ||
        description.includes("desktop") ||
        (!url.includes("mobile") && !description.includes("mobile"))
      );
    }

    return url.includes(device) || description.includes(device);
  });

  return foundMedia?.url || "/placeholder.svg";
};

export const filterImagesByDevice = (
  images: Media[],
  device: string,
): Media[] => {
  return images.filter((image) => {
    if (image.mediaTypeId !== 1) {
      return false;
    }

    const url = image.url.toLowerCase();
    const description = image.description?.toLowerCase() || "";

    if (device === "mobile") {
      return url.includes("mobile") || description.includes("mobile");
    }

    return (
      url.includes("desktop") ||
      description.includes("desktop") ||
      (!url.includes("mobile") && !description.includes("mobile"))
    );
  });
};

export const getThumbnailsByDevice = (
  images: Media[],
  device: string,
): string => {
  return getMediaByDevice(images, 3, device);
};

export const getBannersByDevice = (images: Media[], device: string): string => {
  return getMediaByDevice(images, 2, device);
};
