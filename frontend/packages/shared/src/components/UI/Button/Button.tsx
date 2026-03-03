import React from 'react';
import cl from './Button.module.scss';

type ButtonVariant =
  | 'submit-primary'
  | 'submit-secondary'
  | 'icon'
  | 'trash'
  | 'counter'
  | 'transition-arrow'
  | 'categories'
  | 'burger'
  | 'coupon'
  | 'constructor-link';

type IconType = string | React.ComponentType<any> | React.ReactNode;

type ButtonProps = {
  as?: 'button' | 'a';
  variant?: ButtonVariant;
  text?: React.ReactNode;
  img?: IconType;
  width?: string | number;
  visible?: boolean;
  rotate?: string;
  left?: string;
  open?: boolean;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
  disabled?: boolean;
};

const variantClassMap: Record<ButtonVariant, string> = {
  'submit-primary': cl.button_submit_primary,
  'submit-secondary': cl.button_submit_secondary,
  icon: cl.button_icon,
  trash: cl.button_trash,
  counter: cl.button_counter,
  'transition-arrow': cl.button_transition_arrow,
  categories: cl.button_categories,
  burger: cl.button_burger,
  coupon: cl.button_coupon,
  'constructor-link': cl.button_constructor_link,
};

const renderIcon = (img?: IconType, iconClass?: string) => {
  if (!img) return null;

  if (typeof img === 'string') {
    return <img src={img} alt="" className={iconClass} />;
  }

  if (React.isValidElement(img)) {
    return img;
  }

  if (typeof img === 'function') {
    return React.createElement(img, { className: iconClass });
  }

  return null;
};

const Button: React.FC<ButtonProps> = ({
  as = 'button',
  variant = 'submit-primary',
  text,
  img,
  width,
  visible,
  rotate = '0deg',
  left = '0',
  open = false,
  className = '',
  href,
  target,
  rel,
  type,
  onClick,
  children,
  disabled,
}) => {
  const variantClass = variantClassMap[variant];
  const classNames = [cl.button, variantClass, className].filter(Boolean).join(' ');
  const style: React.CSSProperties = {
    ...(width ? { maxWidth: width } : {}),
    ...(variant === 'transition-arrow'
      ? {
          transform: `rotate(${rotate})`,
          left,
        }
      : {}),
  };

  const withStateClasses = [
    classNames,
    variant === 'transition-arrow' && visible ? cl.button_transition_arrow_visible : '',
    variant === 'burger' && open ? cl.button_burger_open : '',
  ]
    .filter(Boolean)
    .join(' ');

  const iconClassByVariant: Partial<Record<ButtonVariant, string>> = {
    'submit-primary': cl.icon_submit,
    'submit-secondary': cl.icon_submit,
    icon: cl.icon_image,
    trash: cl.icon_trash,
  };

  const icon = renderIcon(img, iconClassByVariant[variant]);
  const resolvedType = type ?? (variant === 'submit-primary' || variant === 'submit-secondary' ? 'submit' : 'button');

  if (as === 'a') {
    return (
      <a
        className={withStateClasses}
        style={style}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {icon}
        {text}
        {children}
      </a>
    );
  }

  return (
    <button className={withStateClasses} style={style} type={resolvedType} onClick={onClick as any} disabled={disabled}>
      {icon}
      {variant === 'burger' ? (
        <>
          <span className={cl.button_burger_line}></span>
          <span className={cl.button_burger_line}></span>
          <span className={cl.button_burger_line}></span>
        </>
      ) : null}
      {text}
      {children}
    </button>
  );
};

export default Button;




