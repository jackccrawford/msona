// Make features more mobile-friendly
<div className="grid grid-cols-2 gap-4">
  {/* Simplified layout for mobile */}
  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Music2 className="w-5 h-5" />
        <span className="text-base font-medium">Key</span>
      </div>
      <div className="text-2xl font-bold">
        {getKeyName(features.key)}
      </div>
      <div className="text-sm">
        {features.mode ? 'Major' : 'Minor'}
      </div>
    </div>
  </div>
  ...
</div>