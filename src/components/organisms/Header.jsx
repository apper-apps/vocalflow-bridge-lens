import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 glass-card border-b border-gray-700 px-4 lg:px-6 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <ApperIcon name="Menu" size={20} />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 lg:mx-0">
        <SearchBar placeholder="Search exercises, users..." />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative">
          <ApperIcon name="Bell" size={20} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <ApperIcon name="Settings" size={20} />
        </Button>

        <Button variant="accent" size="sm" className="hidden sm:flex">
          <ApperIcon name="Mic" size={16} className="mr-2" />
          Start Practice
        </Button>
      </div>
    </header>
  );
};

export default Header;