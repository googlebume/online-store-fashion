import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import cl from './ActionsMenu.module.scss';
import DotsIcon from '../../../assets/images/icons/dotsIcon.svg';
import { MenuActionType } from '@/utils/constants/actionsMenu';

const VIEWPORT_PAD = 8;

type ActionsMenuProps = {
    actionList: MenuActionType[];
    data?: any;
    setIsOpen?: React.Dispatch<React.SetStateAction<any>>
    isOpen?: any
};

const ActionsMenu = forwardRef<HTMLDivElement, ActionsMenuProps>(
    ({ actionList, data }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [shift, setShift] = useState({ x: 0, y: 0 });
        const menuRef = useRef<HTMLDivElement | null>(null);
        const dropdownRef = useRef<HTMLDivElement | null>(null);

        const recalcPosition = useCallback(() => {
            const el = dropdownRef.current;
            if (!el || !isOpen) return;

            setShift((prev) => {
                const rect = el.getBoundingClientRect();
                const pad = VIEWPORT_PAD;
                let x = prev.x;
                let y = prev.y;

                if (rect.right > window.innerWidth - pad) {
                    x += window.innerWidth - pad - rect.right;
                }
                const leftAfter = rect.left + (x - prev.x);
                if (leftAfter < pad) {
                    x += pad - leftAfter;
                }

                if (rect.bottom > window.innerHeight - pad) {
                    y += window.innerHeight - pad - rect.bottom;
                }
                const topAfter = rect.top + (y - prev.y);
                if (topAfter < pad) {
                    y += pad - topAfter;
                }

                if (x === prev.x && y === prev.y) return prev;
                return { x, y };
            });
        }, [isOpen]);

        useLayoutEffect(() => {
            if (!isOpen) {
                setShift({ x: 0, y: 0 });
                return;
            }
            recalcPosition();
            const raf = requestAnimationFrame(() => recalcPosition());
            return () => cancelAnimationFrame(raf);
        }, [isOpen, actionList.length, recalcPosition]);

        useEffect(() => {
            if (!isOpen) return;
            const onLayoutChange = () => recalcPosition();
            window.addEventListener('resize', onLayoutChange);
            window.addEventListener('scroll', onLayoutChange, true);
            return () => {
                window.removeEventListener('resize', onLayoutChange);
                window.removeEventListener('scroll', onLayoutChange, true);
            };
        }, [isOpen, recalcPosition]);

        const handleMenuClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
        };

        const handleOptionClick = (
            e: React.MouseEvent,
            action?: (data?: any) => void
        ) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);

            if (action) {
                action(data);
            }
        };

        // Закриваємо меню при кліку поза ним
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    menuRef.current &&
                    !menuRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen]);

        return (
            <div
                ref={(node) => {
                    // одночасно пробрасываем ref з forwardRef і наш локальний
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    }
                    menuRef.current = node;
                }}
                className={cl.menuMom}
            >
                <div onClick={handleMenuClick}>
                    <DotsIcon width="24px" height="24px" />
                </div>
                <div
                    ref={dropdownRef}
                    className={`${cl.menu} ${isOpen ? cl.open : ''}`}
                    style={
                        isOpen
                            ? { transform: `translate(${shift.x}px, ${shift.y}px)` }
                            : undefined
                    }
                >
                    {actionList.map((action, index) => (
                        <div
                            key={index}
                            className={cl.option}
                            onClick={(e) => handleOptionClick(e, action.action)}
                        >
                            {action.name}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

ActionsMenu.displayName = 'ActionsMenu';

export default ActionsMenu;



