
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const StorySection = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const timelineEvents = [
    {
      year: "2017",
      title: "The Beginning",
      description:
        "Started as a family recipe sharing initiative in our hometown.",
    },
    {
      year: "2019",
      title: "First Local Store",
      description:
        "Opened our first physical store in Jaipur, bringing our products to local food lovers.",
    },
    {
      year: "2020",
      title: "Online Journey",
      description:
        "Launched our online presence to reach pickle and papad enthusiasts across India.",
    },
    {
      year: "2022",
      title: "Expanded Product Line",
      description:
        "Introduced new varieties based on traditional recipes from different regions.",
    },
    {
      year: "2025",
      title: "Looking Ahead",
      description:
        "Aiming to bring the authentic taste of Indian pickles and papads to international markets.",
    },
  ];

  return (
    <section
      id="story"
      ref={ref}
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-turmeric/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute inset-0 bg-fabric-texture opacity-5 -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-maroon font-heritage text-lg">Our Heritage</span>
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mt-2 mb-4">
            Cultural Storytelling
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The journey of Marwad Maratha is rooted in the rich culinary
            traditions of Rajasthan and Maharashtra, bringing authentic flavors
            to your table.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg indian-border">
              <div className="aspect-[4/3] bg-gradient-to-br from-maroon/80 to-saffron/80 flex items-center justify-center">
                <span className="text-white font-heritage text-4xl">
                  Traditional Kitchen
                </span>
              </div>
            </div>
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full overflow-hidden indian-border z-10"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            >
              <div className="w-full h-full bg-turmeric flex items-center justify-center">
                <span className="text-4xl">👵</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-heritage font-bold text-maroon">
              Grandma's Secret Recipes
            </h3>
            <p>
              Our journey began with a treasure trove of recipes handed down
              through generations. Our grandmothers from both Rajasthan and
              Maharashtra were known for their exceptional pickles and papads
              that brought families together during meals.
            </p>
            <p>
              Each recipe carries not just ingredients, but stories, traditions,
              and the essence of Indian hospitality. The perfect balance of
              spices, the patience of sun-drying, and the love that goes into
              each jar is what makes our products special.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <h4 className="font-heritage font-semibold">Rajasthani</h4>
                <p className="text-sm text-muted-foreground">
                  Bold, spicy flavors that reflect the vibrant desert culture
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h4 className="font-heritage font-semibold">Maharashtrian</h4>
                <p className="text-sm text-muted-foreground">
                  Perfect balance of sweet, tangy and spicy elements
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative mt-20"
        >
          <h3 className="text-2xl font-heritage font-bold text-center mb-12">
            Our Journey Since 2017
          </h3>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-maroon to-saffron h-full rounded-full"></div>

            {/* Timeline events */}
            <div className="relative z-10">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  className={`mb-12 flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex-1 md:w-1/2">
                    <div
                      className={`${
                        index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"
                      } p-4`}
                    >
                      <h4 className="text-xl font-heritage font-bold text-saffron">
                        {event.year}
                      </h4>
                      <h5 className="text-lg font-medium mb-2">{event.title}</h5>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white border-4 border-maroon"></div>
                  </div>

                  <div className="flex-1 md:w-1/2 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection;
