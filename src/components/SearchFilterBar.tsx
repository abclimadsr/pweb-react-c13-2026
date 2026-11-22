export type SortMode = "match" | "default";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  categories: string[];
  sort: SortMode;
  onSortChange: (v: SortMode) => void;
}

export default function SearchFilterBar(p: Props) {
  return (
    <div className="row">
      <input
        className="grow"
        value={p.keyword}
        onChange={(e) => p.onKeywordChange(e.target.value)}
        placeholder="Cari posisi atau perusahaan..."
      />
      <select value={p.category} onChange={(e) => p.onCategoryChange(e.target.value)}>
        <option value="all">Semua Kategori</option>
        {p.categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={p.sort} onChange={(e) => p.onSortChange(e.target.value as SortMode)}>
        <option value="match">Match Tertinggi</option>
        <option value="default">Urutan Asli</option>
      </select>
    </div>
  );
}