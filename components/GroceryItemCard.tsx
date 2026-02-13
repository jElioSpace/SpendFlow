
import React from 'react';
import { GroceryItem } from '../types';
import { TrashIcon, EditIcon, CheckCircleIcon } from './Icons';

interface GroceryItemCardProps {
  item: GroceryItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: GroceryItem) => void;
}

const GroceryItemCard: React.FC<GroceryItemCardProps> = ({ item, onToggle, onDelete, onEdit }) => {
  return (
    <div 
      className={`group flex items-center gap-4 p-4 mb-3 rounded-xl border transition-all duration-200 ${
        item.isPurchased 
          ? 'bg-gray-50 border-gray-100 opacity-75' 
          : 'bg-white border-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <button 
        onClick={() => onToggle(item.id)}
        className="flex-shrink-0 transition-transform active:scale-90"
        aria-label={item.isPurchased ? "Mark as unpurchased" : "Mark as purchased"}
      >
        <CheckCircleIcon checked={item.isPurchased} />
      </button>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-semibold text-lg truncate ${item.isPurchased ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {item.name}
          </h3>
          {item.category && !item.isPurchased && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700">
              {item.category}
            </span>
          )}
          {item.isPurchased && item.actualPrice !== undefined && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500 text-white">
              Paid: ${item.actualPrice.toFixed(2)}
            </span>
          )}
          {!item.isPurchased && item.estimatedPrice !== undefined && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-600 border border-blue-100">
              Est: ${item.estimatedPrice.toFixed(2)}
            </span>
          )}
        </div>
        {item.note && (
          <p className={`text-sm mt-0.5 truncate ${item.isPurchased ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
            {item.note}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(item)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <EditIcon />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default GroceryItemCard;
