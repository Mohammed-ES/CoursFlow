import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Send, Zap, Target, BookOpen, Brain, Award, Users, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import WelcomeAnimation from '../components/common/WelcomeAnimation';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const animatedTexts = [
    'Study Experience',
    'Educational Journey',
    'Classroom Experience',
    'Skill Development',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      avatar: 'SJ',
      content: 'CoursFlow has transformed how I manage my studies. The AI assistant is incredibly helpful!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Mathematics Teacher',
      avatar: 'MC',
      content: 'As an instructor, CoursFlow makes it easy to manage courses and track student progress.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Business Administration Student',
      avatar: 'ER',
      content: 'The scheduling feature helps me stay organized. Best learning platform I\'ve used!',
      rating: 5,
    },
  ];

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="overflow-hidden">
      {/* Welcome Animation */}
      {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
      
      {/* Hero Section */}
      <section className="relative bg-gradient-primary min-h-[700px] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          
          {/* Floating Icons */}
          <motion.div
            animate={floatingAnimation}
            className="absolute top-32 right-1/4 opacity-20"
          >
            <Zap className="w-16 h-16 text-white" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute bottom-32 left-1/4 opacity-20"
          >
            <Target className="w-20 h-20 text-white" />
          </motion.div>
        </div>
        
        <div className="container-custom relative z-10 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="block mb-4"
                >
                  Transform Your
                </motion.span>
                <div className="block min-h-[100px] md:min-h-[120px] lg:min-h-[140px] mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTextIndex}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-clip-text text-transparent leading-tight"
                      style={{
                        backgroundSize: '200% auto',
                        animation: 'gradient 3s linear infinite',
                      }}
                    >
                      {animatedTexts[currentTextIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </h1>
              
              {/* Add animation keyframe in style */}
              <style>{`
                @keyframes gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
                  50% { transform: translateY(-20px) rotateX(10deg) rotateY(10deg); }
                }
                .text-3d {
                  text-shadow: 
                    0 1px 0 #ccc,
                    0 2px 0 #c9c9c9,
                    0 3px 0 #bbb,
                    0 4px 0 #b9b9b9,
                    0 5px 0 #aaa,
                    0 6px 1px rgba(0,0,0,.1),
                    0 0 5px rgba(0,0,0,.1),
                    0 1px 3px rgba(0,0,0,.3),
                    0 3px 5px rgba(0,0,0,.2),
                    0 5px 10px rgba(0,0,0,.25),
                    0 10px 10px rgba(0,0,0,.2),
                    0 20px 20px rgba(0,0,0,.15);
                }
              `}</style>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed"
              >
                The smart course management platform that combines powerful organization tools with AI-powered learning assistance.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register" className="inline-block">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-primary-main rounded-xl font-bold text-lg shadow-2xl hover:bg-accent-cyan hover:text-white transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/courses" className="inline-block">
                  <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-white hover:text-primary-main transition-all duration-300 flex items-center justify-center gap-2">
                    Explore Courses
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - 3D Education Element */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -30 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden lg:block relative"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                animate={{
                  rotateY: [0, 10, 0, -10, 0],
                  rotateX: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Text Education */}
                <div className="text-center">
                  <motion.div
                    className="text-8xl font-black text-white text-3d mb-8"
                    style={{
                      transform: 'rotateX(10deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    EDUCATION
                  </motion.div>
                  
                  {/* Floating Books/Elements */}
                  <div className="relative h-64">
                    <motion.div
                      animate={{
                        y: [0, -30, 0],
                        rotateZ: [0, 10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute top-0 left-1/4 w-24 h-32 bg-gradient-to-br from-accent-cyan to-primary-main rounded-lg shadow-2xl"
                      style={{
                        transform: 'rotateY(20deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="absolute inset-2 border-2 border-white/30 rounded"></div>
                      <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white" />
                    </motion.div>

                    <motion.div
                      animate={{
                        y: [0, 30, 0],
                        rotateZ: [0, -10, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                      className="absolute top-12 right-1/4 w-24 h-32 bg-gradient-to-br from-primary-main to-accent-cyan rounded-lg shadow-2xl"
                      style={{
                        transform: 'rotateY(-20deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="absolute inset-2 border-2 border-white/30 rounded"></div>
                      <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white" />
                    </motion.div>

                    <motion.div
                      animate={{
                        y: [0, -20, 0],
                        rotateZ: [0, 5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Award className="w-16 h-16 text-accent-cyan" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative circles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-accent-cyan rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-10 -left-10 w-48 h-48 bg-white rounded-full blur-3xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About CoursFlow Section */}
      <section id="about" className="py-20 bg-white dark:bg-secondary-main relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-main rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <span className="bg-primary-main/10 text-primary-main px-4 py-2 rounded-full text-sm font-semibold">
                  About CoursFlow
                </span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-main dark:text-white mb-6">
                Transform Your Learning Journey
              </h2>
              <div className="space-y-4 text-neutral-darkGray dark:text-neutral-gray text-lg">
                <p>
                  CoursFlow was born from a simple observation: students and educators needed 
                  a better way to manage their learning journey. Traditional platforms were 
                  either too complex or lacked essential features.
                </p>
                <p>
                  Founded in 2025, we set out to create a platform that combines powerful 
                  organization tools with cutting-edge AI technology, making it easier for 
                  everyone to achieve their educational goals.
                </p>
                <p>
                  Today, CoursFlow serves <strong className="text-primary-main">10,000+</strong> students 
                  and educators worldwide, helping them streamline their courses, track progress, 
                  and enhance learning with AI-powered assistance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gradient-to-br from-primary-main/10 to-accent-cyan/10 rounded-2xl"
                >
                  <div className="text-4xl font-bold text-primary-main mb-2">10K+</div>
                  <div className="text-sm text-neutral-darkGray dark:text-neutral-gray">Active Students</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gradient-to-br from-primary-main/10 to-accent-cyan/10 rounded-2xl"
                >
                  <div className="text-4xl font-bold text-primary-main mb-2">95%</div>
                  <div className="text-sm text-neutral-darkGray dark:text-neutral-gray">Satisfaction</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-main to-accent-cyan rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[Target, Zap, Users, Award].map((Icon, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center"
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-accent-cyan rounded-full opacity-20"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-main rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-neutral-offWhite dark:bg-secondary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="bg-primary-main/10 text-primary-main px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-main dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray max-w-3xl mx-auto">
              Comprehensive learning solutions designed with cutting-edge technology to enhance your educational experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Course Management */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full relative overflow-hidden group bg-white dark:bg-secondary-main">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  >
                    <BookOpen className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3">
                    Course Management
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                    Organize all your courses in one unified platform with intuitive navigation and smart categorization.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Service 2: AI Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full relative overflow-hidden group bg-white dark:bg-secondary-main">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3">
                    AI-Powered Learning
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                    Get personalized assistance with AI-powered quiz generation, explanations, and study recommendations.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Service 3: Smart Scheduling */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full relative overflow-hidden group bg-white dark:bg-secondary-main">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Target className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3">
                    Smart Scheduling
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                    Plan your study sessions with an interactive calendar, automated reminders, and deadline tracking.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Service 4: Progress Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full relative overflow-hidden group bg-white dark:bg-secondary-main">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Award className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3">
                    Progress Analytics
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                    Monitor your learning journey with detailed analytics, performance metrics, and visual progress reports.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Service 5: Collaborative Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full relative overflow-hidden group bg-white dark:bg-secondary-main">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3">
                    Collaborative Tools
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                    Connect with instructors and peers, share resources, and collaborate on projects seamlessly.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Service 6: Mobile Access */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card hover className="h-full relative overflow-hidden group bg-white dark:bg-secondary-main">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-3">
                    Anywhere Access
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray leading-relaxed">
                    Access your courses and materials from any device, with seamless synchronization across platforms.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Says (Testimonials) */}
      <section id="community" className="py-20 bg-white dark:bg-secondary-main">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="bg-primary-main/10 text-primary-main px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Community Says
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-main dark:text-white mb-4">
              Loved by Students & Educators
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray">
              See what our community has to say about CoursFlow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="h-full relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary-main to-accent-cyan"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  />
                  <div className="relative pl-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.svg
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                          viewport={{ once: true }}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </motion.svg>
                      ))}
                    </div>
                    <p className="text-neutral-darkGray dark:text-neutral-gray mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-main dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-neutral-darkGray dark:text-neutral-gray">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Map */}
      <section id="contact" className="py-20 bg-neutral-offWhite dark:bg-secondary-dark">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="bg-primary-main/10 text-primary-main px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-main dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="grid gap-6">
                {[
                  { icon: Mail, title: 'Email', info: 'support@coursflow.com', link: 'mailto:support@coursflow.com' },
                  { icon: Phone, title: 'Phone', info: '+1 (555) 123-4567', link: 'tel:+15551234567' },
                  { icon: MapPin, title: 'Office', info: '123 Education Street, Learning City', link: '#' },
                ].map((contact, idx) => {
                  const Icon = contact.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={contact.link}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="block"
                    >
                      <Card hover className="flex items-center p-6 bg-white dark:bg-secondary-main">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-main to-accent-cyan rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-main dark:text-white mb-1">
                            {contact.title}
                          </h3>
                          <p className="text-neutral-darkGray dark:text-neutral-gray">
                            {contact.info}
                          </p>
                        </div>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-80 bg-gradient-to-br from-primary-main/20 to-accent-cyan/20 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary-main mx-auto mb-4" />
                    <p className="text-neutral-darkGray dark:text-neutral-gray font-medium">
                      Interactive Map Integration
                    </p>
                    <p className="text-sm text-neutral-darkGray dark:text-neutral-gray mt-2">
                      123 Education Street, Learning City
                    </p>
                  </div>
                </div>
                
                {/* Animated pins */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-4 h-4 bg-primary-main rounded-full shadow-lg"></div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-white dark:bg-secondary-main">
                <h3 className="text-2xl font-bold text-secondary-main dark:text-white mb-6">
                  Send us a Message
                </h3>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Message sent successfully!
                  </motion.div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-lightGray dark:border-secondary-light bg-white dark:bg-secondary-main text-secondary-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main transition-all"
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full" size="large">
                      Send Message
                      <Send className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"
        />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Transform Your Learning Experience?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-8"
            >
              Join thousands of students and educators using CoursFlow to achieve their educational goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link to="/register">
                <Button size="large" className="bg-white text-primary-main hover:bg-neutral-offWhite hover:scale-105 transition-transform shadow-xl">
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
