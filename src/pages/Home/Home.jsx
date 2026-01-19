import { useState, useEffect, useMemo, useRef } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import GameCard from '../../components/GameCard/GameCard';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const [games, setGames] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('rating');
  const [showButton, setShowButton] = useState(false);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Does the API have more pages
  const topOfPageRef = useRef(null);

  /*
  We will place an invisible "Sentinel" div at the very bottom of the game list.
  When that div becomes visible on the screen, it tells React:
  "Hey, the user reached the bottom! Increase the page number!"
   */
  const observerTarget = useRef(null); // The "invisible" element we will watch

  const { loading } = useAuth();

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {

    //Function to check how far the user has scrolled
    const handleScroll = () => {
      if(window.scrollY > 400){
        setShowButton(true);
      }else {
        setShowButton(false);
      }
    };

    // Add the listener to the window
    window.addEventListener("scroll", handleScroll);

    // ALWAYS remove listeners when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll)
  },[])

  const sortedGames = useMemo(() => {
    // If games hasn't loaded yet, return an empty array to prevent crashes
    if (!games) return [];
    console.log('Sorting games...')
    const sortedGames = [...games].sort((a,b) => {
      if(sortOrder === 'rating') return b.rating - a.rating;
       if (sortOrder === 'name') {
          return (a.name || "").localeCompare(b.name || "");
      }
      if(sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'platform') {
        // 1. Get the platform name for 'a' (drilling into the RAWG structure)
        const platformA = a.platforms?.[0]?.platform?.name || "";
        // 2. Get the platform name for 'b'
        const platformB = b.platforms?.[0]?.platform?.name || "";
        
        // 3. Compare the two strings
        return platformA.localeCompare(platformB);
      }
      return 0; 
    })
    return sortedGames;
  }, [games, sortOrder])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchTerm}&page=${page}&page_size=20`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const gameData = await response.json();
        console.log(gameData.results)
        // If it's page 1, it's a new search -> replace games.
        // If it's page 2+, append games.
        setGames(prev => (page === 1 ? gameData.results : [...prev, ...gameData.results]));

        // Check if data.next is null. If it is, we reached the end of the database
        setHasMore(gameData.next !== null)

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (searchTerm.length > 0 && searchTerm.length < 3) {
      setGames([]);
      setLoading(false); // <--- Add this line!
      return;
    }

    // Debounce for page 1 (searching), but immediate fetch for page 2+ (scrolling)
    if (page === 1) {
      const timer = setTimeout(() => {
        fetchGames();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      fetchGames();
    }

  }, [searchTerm, API_KEY, page]);

  const scrollToTop = () => {
    topOfPageRef.current.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the sentinel is visible AND we aren't currently loading AND there's more to fetch
        if (entries[0].isIntersecting && hasMore && !isloading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 } // 1.0 means the element must be 100% visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // Cleanup the observer when the component unmounts
    return () => observer.disconnect();
  }, [hasMore, isloading]); // Re-run if these status flags change

  /* If the user types a new search, we must reset the page to 1 and clear the list. */
  useEffect(() => {
    setPage(1);
    setGames([]);
    setHasMore(true);
  }, [searchTerm]);

  //This loading check is while the Auth is loading
  if (loading) return <div className="loader">Loading...</div>;

  return (
    <>
      <div ref={topOfPageRef}></div>
      <div className="header-section">
        <div className="controls-row">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          <select 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="sort-dropdown"
            value={sortOrder} /* This makes it a "Controlled Component" */
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="platform">Sort by Platform</option>
          </select>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="game-list">
        {/* Only show the "Searching..." loader if we are on page 1 and have no games yet */}
        {isloading && page === 1 && games.length === 0 && (
           <div className="loader">Searching Database...</div>
        )}

        {games.length > 0 && sortedGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.name}
              image={game.background_image || "https://via.placeholder.com/300x200?text=No+Image"}
              rating={game.rating}
              platform={game.platforms?.[0]?.platform.name || "N/A"}
            />
        ))}

        {/* If search is done and literally nothing was found */}
        {!isloading && games.length === 0 && (
           <p className="no-results">Oops! No games found for "{searchTerm}" 🎮</p>
        )}
      </div>
      <button
        className={`scroll-btn ${!showButton ? 'hidden' : ''}`}
        onClick={scrollToTop}>
          ↑
      </button>
      {/* The invisible box that triggers the next fetch */}
      <div ref={observerTarget} style={{ height: '100px', margin: '20px 0', textAlign: 'center' }}>
        {/* Show a different loader for the "More" items */}
        {isloading && page > 1 && <div className="loader">Loading more games...</div>}
        {!hasMore && games.length > 0 && <p className="no-results">You've reached the end of the galaxy! 🚀</p>}
      </div>
    </>
  );
}

export default Home;