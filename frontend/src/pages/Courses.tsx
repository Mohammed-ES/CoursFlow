import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Clock, Users, Star, BookOpen, Code, Palette, Brain, Database, Globe, TrendingUp, Smartphone, Camera, Music } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import WelcomeAnimation from '../components/common/WelcomeAnimation';

const Courses = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { id: 'programming', name: 'Programming', icon: Code, color: 'from-green-500 to-emerald-600' },
    { id: 'design', name: 'Design', icon: Palette, color: 'from-pink-500 to-rose-600' },
    { id: 'business', name: 'Business', icon: TrendingUp, color: 'from-orange-500 to-amber-600' },
    { id: 'data', name: 'Data Science', icon: Database, color: 'from-purple-500 to-violet-600' },
    { id: 'ai', name: 'AI & ML', icon: Brain, color: 'from-red-500 to-rose-600' },
    { id: 'language', name: 'Languages', icon: Globe, color: 'from-cyan-500 to-blue-600' },
    { id: 'mobile', name: 'Mobile Dev', icon: Smartphone, color: 'from-teal-500 to-cyan-600' },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'from-yellow-500 to-orange-600' },
    { id: 'music', name: 'Music', icon: Music, color: 'from-indigo-500 to-purple-600' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Angela Yu',
      category: 'programming',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      price: 89.99,
      rating: 4.8,
      students: 12453,
      duration: '42 hours',
      level: 'Beginner',
      description: 'Learn HTML, CSS, JavaScript, Node.js, React, MongoDB and more!',
      badge: 'Bestseller',
    },
    {
      id: 2,
      title: 'Python for Data Science and Machine Learning',
      instructor: 'Jose Portilla',
      category: 'data',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
      price: 94.99,
      rating: 4.9,
      students: 18234,
      duration: '38 hours',
      level: 'Intermediate',
      description: 'Master Python for Data Science with NumPy, Pandas, Matplotlib and more.',
      badge: 'Top Rated',
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Daniel Schifano',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      price: 79.99,
      rating: 4.7,
      students: 9876,
      duration: '28 hours',
      level: 'Beginner',
      description: 'Learn UI/UX design from scratch with Figma and Adobe XD.',
      badge: 'Popular',
    },
    {
      id: 4,
      title: 'Advanced React and Redux',
      instructor: 'Stephen Grider',
      category: 'programming',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      price: 84.99,
      rating: 4.8,
      students: 15678,
      duration: '35 hours',
      level: 'Advanced',
      description: 'Master React and Redux with advanced patterns and best practices.',
      badge: 'Bestseller',
    },
    {
      id: 5,
      title: 'Digital Marketing Strategy',
      instructor: 'Rob Percival',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      price: 69.99,
      rating: 4.6,
      students: 11234,
      duration: '24 hours',
      level: 'Beginner',
      description: 'Complete digital marketing course covering SEO, Social Media, Email and more.',
    },
    {
      id: 6,
      title: 'Artificial Intelligence A-Z',
      instructor: 'Hadelin de Ponteves',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      price: 99.99,
      rating: 4.9,
      students: 20145,
      duration: '45 hours',
      level: 'Intermediate',
      description: 'Learn to build AI with real-world applications using Python.',
      badge: 'Top Rated',
    },
    {
      id: 7,
      title: 'Spanish for Beginners',
      instructor: 'Maria Gonzalez',
      category: 'language',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
      price: 49.99,
      rating: 4.7,
      students: 8567,
      duration: '30 hours',
      level: 'Beginner',
      description: 'Learn Spanish from scratch with interactive lessons and exercises.',
    },
    {
      id: 8,
      title: 'Full Stack JavaScript',
      instructor: 'Maximilian Schwarzmüller',
      category: 'programming',
      image: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=400&h=250&fit=crop',
      price: 89.99,
      rating: 4.8,
      students: 16789,
      duration: '50 hours',
      level: 'Intermediate',
      description: 'Master the MERN stack with MongoDB, Express, React and Node.js.',
      badge: 'Bestseller',
    },
    {
      id: 9,
      title: 'Graphic Design Theory',
      instructor: 'Lindsay Marsh',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop',
      price: 64.99,
      rating: 4.6,
      students: 7234,
      duration: '22 hours',
      level: 'Beginner',
      description: 'Learn the fundamentals of graphic design and typography.',
    },
    {
      id: 10,
      title: 'iOS App Development with Swift',
      instructor: 'Angela Yu',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop',
      price: 94.99,
      rating: 4.8,
      students: 14523,
      duration: '48 hours',
      level: 'Intermediate',
      description: 'Build beautiful iOS apps using Swift and SwiftUI from scratch.',
      badge: 'Popular',
    },
    {
      id: 11,
      title: 'Android Development Masterclass',
      instructor: 'Tim Buchalka',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=250&fit=crop',
      price: 89.99,
      rating: 4.7,
      students: 13456,
      duration: '44 hours',
      level: 'Beginner',
      description: 'Complete Android app development using Kotlin and Android Studio.',
    },
    {
      id: 12,
      title: 'Deep Learning and Neural Networks',
      instructor: 'Andrew Ng',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=250&fit=crop',
      price: 109.99,
      rating: 4.9,
      students: 25678,
      duration: '52 hours',
      level: 'Advanced',
      description: 'Master deep learning, neural networks, and TensorFlow.',
      badge: 'Top Rated',
    },
    {
      id: 13,
      title: 'Photography Masterclass',
      instructor: 'Phil Ebiner',
      category: 'photography',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop',
      price: 74.99,
      rating: 4.8,
      students: 11234,
      duration: '32 hours',
      level: 'Beginner',
      description: 'Learn professional photography techniques, lighting, and composition.',
      badge: 'Bestseller',
    },
    {
      id: 14,
      title: 'Music Theory for Beginners',
      instructor: 'Jason Allen',
      category: 'music',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=250&fit=crop',
      price: 54.99,
      rating: 4.7,
      students: 9876,
      duration: '26 hours',
      level: 'Beginner',
      description: 'Understand music theory fundamentals, scales, chords, and composition.',
    },
    {
      id: 15,
      title: 'SQL and Database Design',
      instructor: 'Colt Steele',
      category: 'data',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
      price: 79.99,
      rating: 4.8,
      students: 17890,
      duration: '36 hours',
      level: 'Intermediate',
      description: 'Master SQL, PostgreSQL, MySQL, and database design principles.',
      badge: 'Popular',
    },
    {
      id: 16,
      title: 'French Language Complete Course',
      instructor: 'Pierre Dubois',
      category: 'language',
      image: 'https://images.unsplash.com/photo-1509022792371-d1e1e4a95148?w=400&h=250&fit=crop',
      price: 59.99,
      rating: 4.6,
      students: 7654,
      duration: '35 hours',
      level: 'Beginner',
      description: 'Learn French from A1 to B2 level with native speaker.',
    },
    {
      id: 17,
      title: 'Business Analytics and Intelligence',
      instructor: 'Chris Dutton',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      price: 84.99,
      rating: 4.7,
      students: 12456,
      duration: '40 hours',
      level: 'Intermediate',
      description: 'Master Excel, Power BI, and Tableau for business analytics.',
      badge: 'Popular',
    },
    {
      id: 18,
      title: '3D Animation with Blender',
      instructor: 'Grant Abbitt',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop',
      price: 79.99,
      rating: 4.8,
      students: 10234,
      duration: '38 hours',
      level: 'Intermediate',
      description: 'Create stunning 3D models and animations using Blender 3D.',
      badge: 'Bestseller',
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-offWhite dark:bg-secondary-main">
      {/* Welcome Animation */}
      {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#003B73] via-primary-main to-accent-cyan py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-accent-cyan/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                🎓 {courses.length}+ Premium Courses Available
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-accent-cyan to-white bg-clip-text text-transparent">
                Next Adventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
              Learn from world-class instructors and transform your future with our expert-led courses
            </p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-white rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-main" />
                  <input
                    type="text"
                    placeholder="Search for courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl text-secondary-main text-lg focus:outline-none focus:ring-4 focus:ring-accent-cyan/30 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">18+</div>
                <div className="text-sm md:text-base opacity-90">Courses</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
                <div className="text-sm md:text-base opacity-90">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">4.8★</div>
                <div className="text-sm md:text-base opacity-90">Average Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-16">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary-main dark:text-white mb-2">
                Browse by Category
              </h2>
              <p className="text-neutral-darkGray dark:text-neutral-gray">
                Choose your learning path
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-6 rounded-2xl text-center transition-all overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br ' + category.color + ' text-white shadow-2xl'
                      : 'bg-white dark:bg-secondary-light text-secondary-main dark:text-white hover:shadow-xl'
                  }`}
                >
                  {/* Gradient Background on Hover */}
                  {!isSelected && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  )}
                  
                  <div className="relative z-10">
                    <Icon className="w-10 h-10 mx-auto mb-3" />
                    <span className="text-sm font-bold block">{category.name}</span>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="selectedCategory"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-neutral-darkGray dark:text-neutral-gray text-lg">
              Showing <strong className="text-primary-main text-xl">{filteredCourses.length}</strong> {selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} courses
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full overflow-hidden group cursor-pointer bg-white dark:bg-secondary-light">
                {/* Course Image */}
                <div className="relative overflow-hidden h-52">
                  <motion.img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Price Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                    className="absolute top-4 right-4 bg-white dark:bg-secondary-dark px-4 py-2 rounded-full shadow-lg"
                  >
                    <span className="text-lg font-bold text-primary-main">${course.price}</span>
                  </motion.div>

                  {/* Level Badge */}
                  <div className="absolute top-4 left-4 bg-secondary-main/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    <span className="text-sm font-bold text-white">{course.level}</span>
                  </div>

                  {/* Badge (Bestseller, Popular, etc.) */}
                  {course.badge && (
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.4 }}
                      className="absolute bottom-4 left-4 bg-gradient-to-r from-accent-cyan to-primary-main px-4 py-1.5 rounded-full"
                    >
                      <span className="text-sm font-bold text-white">⭐ {course.badge}</span>
                    </motion.div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">
                  {/* Category Tag */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-primary-main/10 dark:bg-primary-main/20 text-primary-main text-xs font-bold rounded-full">
                      {categories.find(c => c.id === course.category)?.name || course.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3 group-hover:text-primary-main dark:group-hover:text-accent-cyan transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>
                  
                  <p className="text-neutral-darkGray dark:text-neutral-gray text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center space-x-3 mb-5 pb-5 border-b border-neutral-gray/10 dark:border-secondary-main">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                    >
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </motion.div>
                    <div>
                      <p className="text-xs text-neutral-gray dark:text-neutral-gray">Instructor</p>
                      <p className="text-sm font-semibold text-secondary-main dark:text-white">
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-secondary-main dark:text-white">{course.rating}</span>
                      </div>
                      <span className="text-xs text-neutral-gray">Rating</span>
                    </div>
                    <div className="text-center border-x border-neutral-gray/10 dark:border-secondary-main">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Users className="w-4 h-4 text-primary-main" />
                        <span className="font-bold text-secondary-main dark:text-white">{(course.students / 1000).toFixed(1)}k</span>
                      </div>
                      <span className="text-xs text-neutral-gray">Students</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Clock className="w-4 h-4 text-accent-cyan" />
                        <span className="font-bold text-secondary-main dark:text-white">{course.duration.split(' ')[0]}h</span>
                      </div>
                      <span className="text-xs text-neutral-gray">Duration</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/courses/${course.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full bg-gradient-to-r from-primary-main to-accent-cyan hover:shadow-lg hover:shadow-primary-main/30" variant="primary">
                        View Details →
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-20 h-20 mx-auto mb-6 text-neutral-gray" />
            <h3 className="text-2xl font-bold text-secondary-main dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-neutral-darkGray dark:text-neutral-gray mb-6">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
