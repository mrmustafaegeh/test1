  import { Link } from "react-router-dom";
  import { useEffect, useState, useRef } from "react";
  import SearchInput from "./SearchInput";
  import { useUserStore } from "../stores/useUserStore.js";
  import { useImageStore } from "../stores/useImageStore.js";
  import { toast } from "react-hot-toast";

  export const Nav = () => {
    const themes = ["synthwave", "pastel"];
    const [themeIndex, setThemeIndex] = useState(0);
    const { logout } = useUserStore();

    // Zustand store
    // const { getImages, loading } = useImageStore();
const getImages = useImageStore((state) => state.getImages);
const loading = useImageStore((state) => state.loading);

    // Local states
    const [searchTerm, setSearchTerm] = useState("");
    const [excludedSubs, setExcludedSubs] = useState([]);

    // Hardcoded available subfolders to exclude (adjust or fetch dynamically)
    const availableSubs = ["saved", "removed"];

    // Dropdown state & ref for outside click detection
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Apply theme on mount/update
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", themes[themeIndex]);
    }, [themeIndex]);

    // Close dropdown on outside click
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Called only when user clicks "Search" in SearchInput
  // const handleSearch = async (term) => {
  //   setSearchTerm(term);
  //   try {
  //     await getImages({
  //       search: term,
  //       excludeSubfolders: excludedSubs,
  //       includeMain: true,
  //     });
  //   } catch (error) {
  //     toast.error("Failed to fetch images");
  //     console.error(error);
  //   }
  // };

  // Re-run search when excludedSubs change, but only if searchTerm is set
useEffect(() => {
  if (searchTerm.trim() === "" && excludedSubs.length === 0) return;

  const runSearch = async () => {
    try {
      await getImages({
        search: searchTerm,
        excludeSubfolders: excludedSubs,
        includeMain: true,
      });
    } catch (error) {
      toast.error("Failed to fetch images");
      console.error(error);
    }
  };

  runSearch();
}, [searchTerm, excludedSubs, getImages]);

const handleSearch = (term) => {
  setSearchTerm(term);
};


    // Toggle excluded subfolders
    const toggleExclude = (sub) => {
      setExcludedSubs((prev) =>
        prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
      );
    };

    const toggleTheme = () => {
      setThemeIndex((prev) => (prev + 1) % themes.length);
    };

    return (
      <nav className="bg-base-100 text-base-content shadow-lg sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left - Logo */}
            <div className="flex items-center w-1/4 min-w-[150px]">
              <Link to="/" className="flex items-center">
                <button className="focus:outline-none">
                  <img
                    src="./src/assets/logo.png"
                    alt="myLogo"
                    className="h-10 w-auto"
                  />
                </button>
              </Link>
            </div>

            {/* Center - Search Input */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1/2 max-w-xl flex justify-center">
              <SearchInput onSearch={handleSearch} />
            </div>

            {/* Right - Logout + Exclude Dropdown */}
            <div
              className="flex items-center justify-end w-1/4 min-w-[150px] gap-4 relative"
              ref={dropdownRef}
            >
              <Link to="/login">
                <button
                  onClick={logout}
                  className="btn btn-ghost hover:bg-base-200 transition-colors duration-200"
                >
                  Logout
                </button>
              </Link>

              {/* Exclude Subfolders Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="btn btn-outline btn-sm"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  Exclude Subfolders ▼
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 border rounded shadow-lg p-3 z-50 max-h-60 overflow-auto">
                    {availableSubs.map((sub) => (
                      <label
                        key={sub}
                        className="flex items-center gap-2 cursor-pointer mb-1"
                      >
                        <input
                          type="checkbox"
                          checked={excludedSubs.includes(sub)}
                          onChange={() => toggleExclude(sub)}
                        />
                        {sub}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Loading Indicator */}
              {loading && (
                <div className="ml-2 text-sm text-gray-500">Loading...</div>
              )}

              {/* Theme toggle button (disabled for now) */}
              {/* <button
                onClick={toggleTheme}
                className="btn btn-circle btn-ghost hover:bg-base-200 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {themes[themeIndex] === "synthwave" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button> */}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Nav;