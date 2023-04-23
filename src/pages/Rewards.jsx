import React, { useContext } from 'react';
import GiftCard from '../components/GiftCard';
import { PointsContext } from '../components/context/PointsContext';


const Rewards = ({ userData }) => {
    const name = userData?.name;
    const { points, setPoints } = useContext(PointsContext);
    // const [points, setPoints] = useState(userData?.points);

    const updatePoints = (points) => {
        setPoints(points);
    };

    return (
        <div className="flex flex-col">
            <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Rewards</h2>
            <h2 className=" text-2xl text-white text-left mt-4 ">Welcome back <span className='font-bold text-orange-300'>{name}!</span></h2>
            {/* <h2 className="font-bold text-2xl text-orange-300 text-left">{name}</h2> */}
            <h2 className="text-2xl text-white text-left mb-10">With your <span className='font-bold  text-orange-300'>{points} points</span> you can redeem</h2>

            <div className="flex flex-wrap sm:justify-start justify-center gap-8 mt-10">

                {userData.giftCards?.map((giftCard, i) => (
                    <GiftCard
                        key={i}
                        couponCode={giftCard.couponCode}
                        cost={giftCard.cost}
                        isRedeemed={giftCard.isRedeemed}
                        points={points}
                        updatePoints={updatePoints}
                        user={userData}
                        i={i}
                    />
                ))}
            </div>
        </div>
    );
};

export default Rewards;
