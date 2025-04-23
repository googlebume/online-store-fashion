import React from 'react';
import cl from '@/utils/styles/modules/ReviewsList.module.scss'
import ReviewElement from './UI/ReviewElement/ReviewElement';

const ReviewsList = () => {
    return (
        <div className={cl.reviewsList}>
            <ReviewElement
                starCount={5}
                userName='Анатолій'
                review="Дуже якісна річ. Тканина м'яка, приємна, але міцна. Підходить на всі пори року"
                datePuplished='2 тижні тому' />
            <ReviewElement
                starCount={5}
                userName='Олена'
                review="Товар перевершив мої очікування! Матеріал приємний до тіла, не викликає алергії. Дизайн універсальний, поєднується з різними стилями. Після прання не втратив форму та колір"
                datePuplished='1 місяць тому' />
            <button className={cl.loadMoreButton}>Показати більше</button>
        </div>
    );
};

export default ReviewsList;