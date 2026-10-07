import { motion } from "framer-motion";
import { filterItemVariants } from "../../../utils/constantsVariants";
import { useSelector } from "react-redux";
export default function EventCategory({
  category,
  handleCategoryChange,
  id,
  index,
}) {
  const { events } = useSelector((state) => state.events);
  const count = events.filter((event) => {
    return category.id === event.categoryId;
  });

  return (
    <motion.button
      key={category.id}
      type="button"
      onClick={() => handleCategoryChange(category)}
      className={`flex items-center justify-between px-3 py-2 rounded-xl font-label-md text-label-md font-semibold text-left transition-all ${category.id === id ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"}`}
      initial="hidden"
      animate="visible"
      custom={index}
      variants={filterItemVariants}
      whileTap={{ scale: 0.98 }}
      whileHover={{ x: category.id === id ? 0 : 2 }}
    >
      {/* Category Name */}
      <span className="flex items-center gap-2.5">
        <span> {category.name} </span>
      </span>
      {/* Count */}
      <span
        className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${category.id === id ? "bg-white/20" : "text-secondary"}`}
      >
        {count.length}
      </span>
    </motion.button>
  );
}
