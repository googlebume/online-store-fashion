import React from 'react';
import { Link } from 'react-router-dom';

import Arrow from '@packages/shared/src/assets/images/icons/arrowInCircle.svg';
import SpaceBlock from '@packages/shared/src/components/UI/SpaceBlock/SpaceBlock';
import { shopRoutes } from '@packages/shared/src/routes/shop';
import type { StoreInfoPageContent } from './types';
import cl from './StoreInfoArticle.module.scss';

export type StoreInfoHeroFigure = {
    src: string;
    alt: string;
};

export type StoreInfoSideRail = {
    /** URL з імпорту (webpack), напр. зображення з `storeInfoAssets` */
    imageSrc: string;
};

type StoreInfoArticleProps = {
    content: StoreInfoPageContent;
    backgroundTexture?: string;
    /** Якщо задано — смуга SpaceBlock справа на всю висоту блоку (напр. «Про нас») */
    sideRail?: StoreInfoSideRail;
    heroFigure?: StoreInfoHeroFigure;
};

const StoreInfoArticle = ({ content, backgroundTexture, heroFigure, sideRail }: StoreInfoArticleProps) => {
    const showHeroFigure = Boolean(heroFigure && !sideRail);

    const mainColumn = (
        <>
            <div className={cl.top}>
                <span className={cl.accentBar} aria-hidden />
                <div className={cl.topRow}>
                    <span className={cl.kicker}>Fashion · службові сторінки</span>
                    <Link to={`/${shopRoutes.shop}`} className={cl.backLink}>
                        <span className={cl.backIcon} aria-hidden>
                            <Arrow width={17} height={17} />
                        </span>
                        Назад у магазин
                    </Link>
                </div>
            </div>

            <header className={cl.hero}>
                <div className={showHeroFigure ? cl.heroGrid : cl.heroSingle}>
                    <div className={cl.heroText}>
                        <h1 className={cl.title}>{content.title}</h1>
                        {content.lead ? <p className={cl.lead}>{content.lead}</p> : null}
                    </div>
                    {showHeroFigure && heroFigure ? (
                        <figure className={cl.heroFigure}>
                            <img
                                src={heroFigure.src}
                                alt={heroFigure.alt}
                                className={cl.heroImg}
                                loading="eager"
                                decoding="async"
                            />
                        </figure>
                    ) : null}
                </div>
            </header>

            <div className={cl.sections}>
                {content.sections.map((section, i) => (
                    <section key={i} className={cl.section}>
                        {section.title ? (
                            <h2 className={cl.sectionTitle}>
                                <span className={cl.sectionTitleText}>{section.title}</span>
                            </h2>
                        ) : null}
                        {section.paragraphs?.map((text, k) => (
                            <p key={k} className={cl.paragraph}>
                                {text}
                            </p>
                        ))}
                        {section.links?.length ? (
                            <ul className={cl.linkList}>
                                {section.links.map((item, j) => (
                                    <li key={j} className={cl.linkItem}>
                                        <a className={cl.contentLink} href={item.href}>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                ))}
            </div>
        </>
    );

    return (
        <article className={cl.root} lang="uk">
            <div className={[cl.bleed, sideRail ? cl.bleedFlushFooter : ''].filter(Boolean).join(' ')}>
                {backgroundTexture ? (
                    <div
                        className={cl.textureLayer}
                        style={{ backgroundImage: `url(${backgroundTexture})` }}
                        role="presentation"
                    />
                ) : null}
                <div className={cl.scrim} aria-hidden />
                <div className={cl.bleedContent}>
                    <div className={[cl.frame, sideRail ? cl.frameSideRail : ''].filter(Boolean).join(' ')}>
                        {sideRail ? (
                            <div className={cl.withRail}>
                                <div className={cl.railMain}>{mainColumn}</div>
                                <div className={cl.railAside}>
                                    <SpaceBlock variant="sidebar" imageSrc={sideRail.imageSrc} />
                                </div>
                            </div>
                        ) : (
                            mainColumn
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default StoreInfoArticle;
