"use client"

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Simple custom tooltip implementation
const TooltipProvider = ({ children, delayDuration = 300 }) => {
  return children;
};

const Tooltip = ({ children, open: controlledOpen, defaultOpen = false, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = controlledOpen !== undefined ? controlledOpen : isOpen;
  const setOpen = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };

  // Clone children and pass down open state and setOpen function
  const childWithProps = React.cloneElement(children, {
    ...children.props,
    tooltipOpen: open,
    setTooltipOpen: setOpen
  });

  return childWithProps;
};

const TooltipTrigger = ({ children, tooltipOpen, setTooltipOpen }) => {
  const handleMouseEnter = () => {
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  const handleFocus = () => {
    setTooltipOpen(true);
  };

  const handleBlur = () => {
    setTooltipOpen(false);
  };

  return React.cloneElement(children, {
    ...children.props,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-describedby": tooltipOpen ? "tooltip-content" : undefined
  });
};

const TooltipContent = React.forwardRef(({ children, className, side = "top", align = "center", ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (props.open) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [props.open]);

  useEffect(() => {
    if (visible && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();

      let top, left;

      switch (side) {
        case 'bottom':
          top = triggerRect.bottom + 5;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2;
          left = triggerRect.left - (contentRect?.width || 0) - 5;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2;
          left = triggerRect.right + 5;
          break;
        case 'top':
        default:
          top = triggerRect.top - (contentRect?.height || 0) - 5;
          break;
      }

      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            left = triggerRect.left;
            break;
          case 'end':
            left = triggerRect.right - (contentRect?.width || 0);
            break;
          case 'center':
          default:
            left = triggerRect.left + triggerRect.width / 2 - (contentRect?.width || 0) / 2;
            break;
        }
      }

      setPosition({ top, left });
    }
  }, [visible, side, align]);

  if (!visible) return null;

  return (
    <div
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      id="tooltip-content"
      className={cn(
        "z-50 fixed overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md",
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: side === 'left' || side === 'right' ? 'translateY(-50%)' : 'none'
      }}
      role="tooltip"
      {...props}
    >
      {children}
    </div>
  );
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };