import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Sidebar, Loader } from './components';
import { Discover, Rewards, Account, Logout } from './pages';
import UpcomingArtists from './pages/UpcomingArtists';
import AudioPlayer from './components/MusicPlayer2/AudioPlayer';
import ArtistDashboard from './components/artistComponents/AllSongs'
import ArtistAddSong from './components/artistComponents/AddNewSong'
import Landing from './pages/Landing'
import { PointsContext } from './components/context/PointsContext';
import { SongContext } from './components/context/SongContext';
import { UserDataContext } from './components/context/UserDataContext';
import 'react-toastify/dist/ReactToastify.css';
import { useUserData, useSongsData } from './customHooks';

const App = () => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [userData, isFetchingUserData, fetchUserData] = useUserData();
  const { songsData, artistData, isFetchingSongsData, getSongsData } = useSongsData();

  const loginUser = (userInfo) => {
    setUser(userInfo);
  };

  useEffect(() => {
    getSongsData();
  }, []);

  useEffect(() => {
    setPoints(userData?.points);
  }, [userData]);

  useEffect(() => {
    if (user) {
      fetchUserData(user);
    }
  }, [user]);

  const isArtist = userData?.points === undefined;
  if (!(user)) return <Landing loginUser={loginUser} />;
  if (isFetchingUserData || isFetchingSongsData || !userData) return <Loader title="Loading User" />;
  const shouldRenderAudioPlayer = !isArtist;

  return (
    <UserDataContext.Provider value={{ userData, isFetchingUserData, fetchUserData }}>
      <SongContext.Provider value={{ trackIndex, setTrackIndex, isPlaying, setIsPlaying }}>
        <PointsContext.Provider value={{ points, setPoints }}>
          <div className="relative flex">
            <Sidebar isArtist={isArtist} />
            <div className={`flex-1 flex flex-col ${isArtist ? 'bg-slate-200' : 'bg-gradient-to-br from-[#49a09d] to-[#5f2c82]'}`}>
              <div className="px-6 h-[calc(100vh)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
                <div className="flex-1 h-fit pb-40">
                  <Routes>
                    <Route path="/" element={isArtist ? <ArtistDashboard userData={userData} /> : <Discover songsData={songsData} isFetchingSongsData={isFetchingSongsData} />} />
                    <Route path="/login" element={<Landing loginUser={loginUser} />} />
                    <Route path="/upcoming-artists" element={<UpcomingArtists artistData={artistData} isFetchingSongsData={isFetchingSongsData} />} />
                    <Route path="/rewards" element={<Rewards userData={userData} />} />
                    <Route path="/account" element={<Account isArtist={isArtist} />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/addSong" element={<ArtistAddSong userData={userData} />} />
                  </Routes>
                </div>
                <div className="xl:sticky relative top-0 h-fit">
                </div>
              </div>
            </div>
            {shouldRenderAudioPlayer && (
              <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
                <AudioPlayer songsData={songsData} isFetchingData={isFetchingSongsData} user={userData} />
              </div>
            )}
          </div>
        </PointsContext.Provider>
      </SongContext.Provider>
    </UserDataContext.Provider>
  );
};

export default App;
