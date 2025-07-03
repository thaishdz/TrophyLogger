function SearchBox() {
  return (
    <>
      <h3 className="font-bold mt-6 mb-3">Search games</h3>
      <div className="flex justify-center items-center relative w-300">
        <input
          className="w-full px-4 py-2 pr-10 rounded-md focus:outline-none bg-gray-100"
          type="text"
          placeholder="ej. Hades"
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          type="submit"
        >
          <svg
            className="w-5 h-5 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              d="M21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

export default SearchBox;
