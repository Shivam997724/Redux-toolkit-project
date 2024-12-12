import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllItems, setCurrentPage, removeCard,updateDisplayedCards} from './Slice/CartSlice';
import './App.css'

const Carts = () => {
    const { carts, loading, error, currentPage, itemsPerPage, displayedCards } = useSelector(state => state.cart)
    const dispatch = useDispatch()



    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        dispatch(getAllItems())
    }, [dispatch])


    useEffect(() => {
        dispatch(updateDisplayedCards());
    }, [currentPage, dispatch]);


    const totalPages = Math.ceil(carts.length / itemsPerPage);

    const handleRemoveCard = (cardId) => {
        dispatch(removeCard(cardId));
        // If there are fewer than 6 cards, add a new card from the next page
        if (displayedCards.length < itemsPerPage && currentPage < totalPages) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page))
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            dispatch(setCurrentPage(currentPage - 1));
        }
    };

    if (initialLoading) {
        return <div>Loading...</div>;
    }


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div>
       
            <div className='cards-container'>
                {displayedCards.map((cart) => (
                    <div key={cart.id} className='card-item'>
                    <div className="card" style={{width:" 18rem"}}>
                    <img src={cart.image} class="card-img-top" alt="..."/>
                    <div className="card-body">
                      <h5 className="card-title">{cart.title}</h5>
                      <p className="card-text">{cart.category}</p>
                      <h6 className='card-text'>Price:{cart.price}</h6> <button
                                className="remove-button"
                                onClick={() => handleRemoveCard(cart.id)}
                            >
                                &#10005; {/* Red cross icon */}
                            </button>
                    </div>
                  
                  </div>
                   
                           
                        </div>
                  
                ))}
                </div>
            


            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>


                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    )
}

export default Carts;