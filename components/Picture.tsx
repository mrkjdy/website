export type PictureProps = {
  avifSrc: string;
  jpegSrc: string;
  alt: string;
  width: number | undefined;
  height: number | undefined;
  class?: string | undefined;
};

// Fresh should automatically serve these resources with appropriate cache
// headers. See https://fresh.deno.dev/docs/concepts/static-files

export default (props: PictureProps) => (
  <picture>
    <source srcset={props.avifSrc} type="image/avif" />
    <source srcset={props.jpegSrc} type="image/jpeg" />
    <img
      src={props.jpegSrc}
      alt={props.alt}
      width={props.width}
      height={props.height}
      class={props.class}
    />
  </picture>
);
