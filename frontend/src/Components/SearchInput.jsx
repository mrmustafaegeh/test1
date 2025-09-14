import { Search } from "lucide-react";
import { useState } from "react";

const SearchInput = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const triggerSearch = () => {
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") triggerSearch();
  };

  return (
    <div className="flex items-center gap-2">
      <label className="input input-bordered flex items-center gap-2 w-96">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="grow"
          placeholder="Search..."
        />
        <button className="btn btn-ghost btn-circle" onClick={triggerSearch}>
          <Search className="h-5 w-5" />
        </button>
      </label>
    </div>
  );
};

export default SearchInput;
