import React from 'react';
import cl from '@/utils/styles/ReviewAdd.module.scss'

const ReviewAdd = () => {
    return (
        <div className={cl.addReview}>
                        <h3 className={cl.addReviewTitle}>Залишити відгук</h3>
                        <div className={cl.ratingInput}>
                            <label className={cl.ratingLabel}>Ваша оцінка</label>
                            <div className={cl.ratingStarsInput}>
                                <i className="far fa-star"></i>
                                <i className="far fa-star"></i>
                                <i className="far fa-star"></i>
                                <i className="far fa-star"></i>
                                <i className="far fa-star"></i>
                            </div>
                        </div>
                        <div className={cl.nameInput}>
                            <label className={cl.inputLabel}>Ім'я</label>
                            <input type="text" className={cl.textInput} />
                        </div>
                        <div className={cl.reviewInput}>
                            <label className={cl.inputLabel}>Відгук</label>
                            <textarea className={cl.textareaInput} rows={3}></textarea>
                        </div>
                        <input type="submit" className={cl.submitButton} value={"Надіслати"}/>
                    </div>
    );
};

export default ReviewAdd;