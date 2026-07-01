import type { TargetAndTransition, Variants } from "framer-motion";

/**
 * 1. Chuyển động cho danh sách (Grid / List)
 * Áp dụng hiệu ứng thác đổ (Staggered fade-in)
 */
export const MOTION_LIST_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const MOTION_LIST_ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

/**
 * 2. Chuyển động cho các phần tử đứng độc lập (Headers, Banners, Single Cards)
 */
export const MOTION_FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const MOTION_FADE_IN: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

/**
 * 3. Chuyển động cho Modals, Popovers và Dialogs
 */
export const MOTION_DIALOG: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

/**
 * 4. Chuyển động đổi trang toàn cục (Page Transitions)
 */
export const MOTION_PAGE_TRANSITION: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeInOut" } },
};

/**
 * 5. Các cấu hình tương tác chuột (Hover / Tap / Press) dùng chung cho Button & Card
 */
export const INTERACT_CARD_HOVER: TargetAndTransition = {
  y: -6,
  scale: 1.01,
  transition: { duration: 0.2, ease: "easeInOut" },
};

export const INTERACT_BUTTON_TAP: TargetAndTransition = {
  scale: 0.96,
  transition: { duration: 0.1 },
};
