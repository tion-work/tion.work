"use client";

import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DropdownItem {
  value: string;
  label: string;
  flag?: string;
}

interface DropdownProps {
  items: DropdownItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

export function Dropdown({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  className = "",
  triggerClassName = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedItem = items.find((item) => item.value === value);

  const handleItemClick = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 触发器 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 ${triggerClassName}`}
      >
        {selectedItem && (
          <>
            {selectedItem.flag && (
              <span className="text-sm">{selectedItem.flag}</span>
            )}
            <span className="text-sm">{selectedItem.label}</span>
          </>
        )}
        {!selectedItem && (
          <span className="text-sm text-gray-500">{placeholder}</span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => handleItemClick(item.value)}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                  value === item.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {item.flag && <span className="text-sm">{item.flag}</span>}
                <span>{item.label}</span>
                {value === item.value && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
