import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase-config';

const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const [isFetchingUserData, setIsFetchingUserData] = useState(false);

    const fetchUserData = async (user) => {
        setIsFetchingUserData(true);
        const docRefListener = doc(db, 'listener', user.uid);
        const docSnapListener = await getDoc(docRefListener);

        const docRefArtist = doc(db, 'artist', user.uid);
        const docSnapArtist = await getDoc(docRefArtist);

        Promise.all([docSnapListener, docSnapArtist])
            .then(() => {
                if (docSnapListener.exists() || docSnapArtist.exists()) {
                    const data = { ...docSnapListener.data(), ...docSnapArtist.data() };
                    setUserData({ ...data, uid: user.uid });
                } else {
                    toast.error('No such Data!', {
                        position: 'top-center',
                    });
                    const navigate = useNavigate();
                    navigate('/login');
                }
            })
            .catch((error) =>
                toast.error(error.message, {
                    position: 'top-center',
                })
            );
        setIsFetchingUserData(false);
    };

    return [userData, isFetchingUserData, fetchUserData];
};

export default useUserData;
