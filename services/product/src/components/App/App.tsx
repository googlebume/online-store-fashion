import React, { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import cl from './App.module.scss'
import ColorSelection from '../ColorSelection';

export const App = () => {

    return (
        <div className={cl.productPage}>
            {/* Product Section */}
            <main className={cl.productContainer}>
                <div className={cl.productLayout}>
                    {/* Product Gallery */}
                    <div className={cl.productGallery}>
                        <div className={cl.mainImageContainer}>
                            <img
                                src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                                alt="Premium Leather Jacket"
                                className={cl.mainImage}
                            />
                        </div>
                        <div className={cl.thumbnailContainer}>
                            <button className={cl.thumbnailButton}>
                                <img
                                    src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                                    alt="Premium Leather Jacket"
                                    className={cl.thumbnailImage}
                                />
                            </button>
                            <button className={cl.thumbnailButton}>
                                <img
                                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80"
                                    alt="Premium Leather Jacket Back"
                                    className={cl.thumbnailImage}
                                />
                            </button>
                            <button className={cl.thumbnailButton}>
                                <img
                                    src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                                    alt="Premium Leather Jacket Detail"
                                    className={cl.thumbnailImage}
                                />
                            </button>
                            <button className={cl.thumbnailButton}>
                                <img
                                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                                    alt="Premium Leather Jacket Worn"
                                    className={cl.thumbnailImage}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className={cl.productInfo}>
                        <div className={cl.productDetails}>
                            <h1 className={cl.productTitle}>Шкіряна куртка Premium</h1>
                            <div className={cl.ratingContainer}>
                                <div className={cl.ratingStars}>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star-half-alt"></i>
                                </div>
                                <span className={cl.ratingCount}>(42 відгуки)</span>
                            </div>
                            <div className={cl.priceContainer}>
                                <span className={cl.currentPrice}>₴4,999</span>
                                <span className={cl.oldPrice}>₴6,499</span>
                                <span className={cl.discountBadge}>-23%</span>
                            </div>
                            <p className={cl.productDescription}>
                                Елегантна шкіряна куртка преміум якості з м'якою підкладкою.
                                Виготовлена з натуральної шкіри високої якості, що забезпечує
                                довговічність та комфорт у будь-яку погоду.
                            </p>
                        </div>

                        {/* Color Selection */}
                        <ColorSelection />

                        {/* Size Selection */}
                        <div className={cl.sizeSelection}>
                            <div className={cl.sizeHeader}>
                                <h3 className={cl.sizeTitle}>Розмір:</h3>
                                <a href="#" className={cl.sizeGuideLink}>Таблиця розмірів</a>
                            </div>
                            <div className={cl.sizeOptions}>
                                <button className={cl.sizeButton}>XS</button>
                                <button className={cl.sizeButton}>S</button>
                                <button className={`${cl.sizeButton} ${cl.selected}`}>M</button>
                                <button className={cl.sizeButton}>L</button>
                                <button className={cl.sizeButton}>XL</button>
                            </div>
                        </div>

                        {/* Quantity & Add to Cart          Тут треба щось рішать*/}
                        <div className={cl.purchaseSection}>
                            <div className={cl.quantityContainer}>
                                <div className={cl.quantityControls}>
                                    <button className={cl.quantityButton}>-</button>
                                    <span className={cl.quantityValue}>1</span>
                                    <button className={cl.quantityButton}>+</button>
                                </div>
                                <button className={cl.addToCartButton}>
                                    <i className="fas fa-shopping-bag"></i> Додати у кошик
                                </button>
                            </div>
                            <div className={cl.actionButtons}>
                                <button className={cl.wishlistButton}>
                                    <i className="far fa-heart"></i> В обране
                                </button>
                                <button className={cl.compareButton}>
                                    <i className="fas fa-exchange-alt"></i> Порівняти
                                </button>
                            </div>
                        </div>

                        {/* Product Details Accordion */}
                        <div className={cl.detailsAccordion}>
                            <div className={cl.accordionItem}>
                                <button className={cl.accordionButton}>
                                    <span>Деталі товару</span>
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                                <div className={cl.accordionContent}>
                                    <ul className={cl.detailsList}>
                                        <li>Матеріал: 100% натуральна шкіра</li>
                                        <li>Підкладка: 100% бавовна</li>
                                        <li>Країна виробництва: Італія</li>
                                        <li>Застібка: блискавка + ґудзики</li>
                                        <li>Кишені: 2 зовнішні, 2 внутрішні</li>
                                        <li>Вага: 1.2 кг</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={cl.accordionItem}>
                                <button className={cl.accordionButton}>
                                    <span>Доставка та повернення</span>
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                                <div className={cl.accordionContent}>
                                    <p>Безкоштовна доставка при замовленні від ₴2000.</p>
                                    <p>Термін доставки: 1-3 робочих дні.</p>
                                    <p>Можливість повернення протягом 14 днів після отримання.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Related Products */}
            <section className={cl.relatedProducts}>
                <h2 className={cl.sectionTitle}>Схожі товари</h2>
                <div className={cl.productsGrid}>
                    <div className={cl.productCard}>
                        <div className={cl.productImageContainer}>
                            <img
                                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80"
                                alt="Leather Biker Jacket"
                                className={cl.productImage}
                            />
                            <div className={cl.productBadge}>NEW</div>
                        </div>
                        <div className={cl.productInfo}>
                            <h3 className={cl.productName}>Куртка байкера</h3>
                            <div className={cl.productPriceContainer}>
                                <span className={cl.productPrice}>₴3,799</span>
                                <span className={cl.productOldPrice}>₴4,299</span>
                                <button className={cl.favoriteButton}>
                                    <i className="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Додаткові товари можна додати аналогічно */}
                </div>
            </section>

            {/* Reviews Section */}
            <section className={cl.reviewsSection}>
                <h2 className={cl.sectionTitle}>Відгуки (42)</h2>
                <div className={cl.reviewsLayout}>
                    {/* Review Stats */}
                    <div className={cl.reviewStats}>
                        <div className={cl.ratingSummary}>
                            <div className={cl.averageRating}>4.8</div>
                            <div className={cl.ratingDetails}>
                                <div className={cl.ratingStars}>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star-half-alt"></i>
                                </div>
                                <div className={cl.ratingLabel}>Середня оцінка</div>
                            </div>
                        </div>
                        <div className={cl.ratingBars}>
                            <div className={cl.ratingBar}>
                                <span>5</span>
                                <i className="fas fa-star"></i>
                                <div className={cl.barContainer}>
                                    <div className={cl.barFill} style={{ width: '80%' }}></div>
                                </div>
                                <span>34</span>
                            </div>
                            {/* Додаткові рейтингові шкали */}
                        </div>
                    </div>

                    {/* Add Review */}
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
                        <button className={cl.submitButton}>Надіслати</button>
                    </div>
                </div>

                {/* Reviews List */}
                <div className={cl.reviewsList}>
                    <div className={cl.reviewItem}>
                        <div className={cl.reviewHeader}>
                            <div className={cl.reviewRating}>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <span className={cl.reviewerName}>Андрій</span>
                            <span className={cl.reviewDate}>2 тижні тому</span>
                        </div>
                        <p className={cl.reviewText}>
                            Дуже якісна куртка! Шкіра м'яка, але міцна. Підходить на всі пори року.
                        </p>
                    </div>
                    {/* Додаткові відгуки */}
                </div>
                <button className={cl.loadMoreButton}>Показати більше</button>
            </section>
        </div>
    );
};

