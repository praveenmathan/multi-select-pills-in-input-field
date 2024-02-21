import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  interface Users {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
  }
  const base_url = 'https://dummyjson.com/users/search?q=';

  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchResult, setSearchResult] = useState<Users[]>([]);
  const [selectedValuesForPills, setSelectedValuesForPills] = useState<Users[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
  }, [searchInputValue]);

  /* to handle the search text */
  const handleSearchText = (e: { target: { value: any } }) => {
    setSearchInputValue(e.target.value);
  }

  /* Fetch the users based on search Value */
  const fetchUsers = () => {
    if (searchInputValue === null || searchInputValue === '') {
      return;
    }
    fetch(base_url + searchInputValue).then(response => response.json()).then((data) => { console.log(data); setSearchResult(data.users) })
      .catch((error) => { console.log(error); })
  }

  /*  Add selected user in pills and display it in result area */
  const handleUserPills = (user: Users): MouseEventHandler<HTMLLIElement> => {
    return (event) => {
      event.preventDefault();
      console.log(user);
      setSelectedValuesForPills(preval => [...preval, user]);
      setSearchInputValue("");
      setSearchResult([]);
      inputRef.current?.focus();
    };
  }

  /*  Displaying Search Results in a list format */
  const handleListOfSearchResult = (searchResult: Users[]) => {
    return searchResult.map((user) => (<li key={user.id} onClick={handleUserPills(user)}>{<><img src={user.image} /> <div>{user.firstName + " " + user.lastName}</div></>}</li>));
  }

  /* Remove the selected User from Pill List and update the Search Input Field */
  const removeSelectedPill = (user: Users): MouseEventHandler<HTMLLIElement> => {
    return (event) => {
      event.preventDefault();
      console.log('user to remove', user);
      let newSelectedValuesForPills = selectedValuesForPills.filter(pills => (pills.id !== user.id));
      setSelectedValuesForPills(newSelectedValuesForPills);
    }
  }

  return (
    <>
      <div className='user-input-container'>
        <div className='user-input-wrapper'>
          {/* Pills */}
          {selectedValuesForPills.map((user) => (
            <>
              <span className='user-pills' key={user.id}>
                {user.firstName + " " + user.lastName}
                <span className='user-pills-close' key={user.id} onClick={removeSelectedPill(user)}>&#x2717;</span>
              </span>
            </>
          ))}

          {/* Input Field for Search Text */}
          <input ref={inputRef} type='text' value={searchInputValue} onChange={handleSearchText} placeholder='search for the users...' />

          { /* Search Suggestions */}
          <ul className='user-list'>
            {handleListOfSearchResult(searchResult)}
          </ul>

        </div>
      </div>
    </>
  )
}

export default App
