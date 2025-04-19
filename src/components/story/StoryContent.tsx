
import { motion } from "framer-motion";

const StoryContent = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-heritage font-bold text-maroon">Our Heritage</h2>
        <p className="text-muted-foreground leading-relaxed">
          From the heart of Gondia, we bring you authentic flavors that have been crafted with care and tradition.
          Our journey is rooted in preserving authentic tastes and quality of 
          handcrafted pickles, papads, and snacks.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Each product in our collection is carefully prepared using time-honored methods and the finest 
          ingredients, ensuring that every bite delivers the genuine taste of traditional Indian cuisine to 
          your family's table.
        </p>
        <div className="pt-4">
          <motion.button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-maroon text-white px-6 py-3 rounded-full inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 12h12m-6-6 6 6-6 6"></path>
            </svg>
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative aspect-square rounded-lg overflow-hidden"
      >
        <img
          src="/images/mango-pickle.jpg"
          alt="Traditional Indian Pickles"
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>
    </div>
  );
};

export default StoryContent;
