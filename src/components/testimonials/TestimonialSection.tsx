
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    image: "/src/assets/testimonial-1.jpg",
    quote:
      "The mango pickle reminds me of my childhood in Rajasthan. The authentic taste brings back memories of my grandmother's kitchen. Absolutely love it!",
    rating: 5,
  },
  {
    id: 2,
    name: "Rajesh Agarwal",
    location: "Delhi, NCR",
    image: "/src/assets/testimonial-2.jpg",
    quote:
      "I've tried many papad brands, but Marwad Maratha's rice papad has the perfect crispiness and flavor. It's now a staple in our family gatherings.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ananya Desai",
    location: "Pune, Maharashtra",
    image: "/src/assets/testimonial-3.jpg",
    quote:
      "The lemon pickle is the perfect blend of tangy and spicy. I appreciate how they've maintained the traditional taste while ensuring good quality.",
    rating: 4,
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Jaipur, Rajasthan",
    image: "/src/assets/testimonial-4.jpg",
    quote:
      "As someone from Rajasthan, I'm very particular about my pickles. Marwad Maratha's garlic pickle is exceptional - perfectly spiced and preserved.",
    rating: 5,
  },
  {
    id: 5,
    name: "Meera Patel",
    location: "Ahmedabad, Gujarat",
    image: "/src/assets/testimonial-5.jpg",
    quote:
      "The quality and taste of their products is outstanding. The masala papad is my favorite - it has the perfect blend of spices and crunch.",
    rating: 5,
  },
];

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-16 md:py-24 bg-gradient-to-b from-background via-spiceYellow/20 to-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-turmeric/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-maroon/5 blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-maroon font-heritage text-lg">Customer Love</span>
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mt-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Authentic reviews from our community who have made Marwad Maratha
            pickles and papads part of their culinary journey.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-xl overflow-hidden mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative p-8 md:p-12">
              {/* Quote marks */}
              <div className="absolute top-4 left-4 text-6xl text-spiceYellow opacity-30 font-serif">
                "
              </div>
              <div className="absolute bottom-4 right-4 text-6xl text-spiceYellow opacity-30 font-serif">
                "
              </div>

              <div className="relative z-10">
                <motion.p
                  key={testimonials[activeTestimonial].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-xl text-center mb-6 font-medium italic"
                >
                  {testimonials[activeTestimonial].quote}
                </motion.p>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-saffron/80 to-maroon/80 rounded-full flex items-center justify-center text-3xl mb-4">
                    {/* Display initials as placeholder */}
                    {testimonials[activeTestimonial].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h4 className="font-bold text-lg">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-muted-foreground">
                    {testimonials[activeTestimonial].location}
                  </p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={
                          star <= testimonials[activeTestimonial].rating
                            ? "#FEC006"
                            : "none"
                        }
                        stroke={
                          star <= testimonials[activeTestimonial].rating
                            ? "#FEC006"
                            : "currentColor"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-0.5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial navigation */}
          <motion.div
            className="flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === index
                    ? "bg-maroon scale-125"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              ></button>
            ))}
          </motion.div>

          {/* Customer interview button */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <p className="mb-4 text-muted-foreground">
              Want to share your experience with our products?
            </p>
            <motion.button
              className="bg-saffron hover:bg-saffron/90 text-white rounded-full py-3 px-8 font-medium inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule a Video Interview
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
