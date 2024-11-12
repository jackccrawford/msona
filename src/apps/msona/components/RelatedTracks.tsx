// Make related tracks more touch-friendly
<div className="grid grid-cols-1 gap-3">
  {tracks.map(track => (
    <div
      key={track.id}
      className="flex items-center gap-4 p-4 rounded-lg..."
      onClick={...}
    >
      <div className="relative">
        <img
          src={track.album.images[2]?.url || track.album.images[0]?.url}
          alt={track.album.name}
          className="w-14 h-14 rounded" // Larger image
        />
        {track.preview_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
            {currentlyPlaying === track.id ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </div>
        )}
      </div>
      ...
    </div>
  ))}
</div>