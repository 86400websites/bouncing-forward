/** Privacy-enhanced, lazy YouTube embed in a 16:9 frame. */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="bg-primary/5 relative aspect-video w-full overflow-hidden rounded-xl">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
