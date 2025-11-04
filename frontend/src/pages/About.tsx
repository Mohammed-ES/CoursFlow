import { motion } from 'framer-motion';
import { Target, Users, Award, TrendingUp, Heart, Zap } from 'lucide-react';
import Card from '../components/common/Card';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize online learning by providing an intuitive platform that empowers students and educators to achieve their full potential.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a supportive community where learners and educators collaborate and grow together.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We are committed to delivering the highest quality educational experience through continuous innovation.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology, including AI, to make learning more effective and engaging.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about education and dedicated to making a positive impact on learners worldwide.',
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'We foster continuous improvement and growth for both our platform and our users.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      avatar: 'SJ',
      description: 'Former educator with 15+ years of experience in online learning.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      avatar: 'MC',
      description: 'Tech innovator specializing in AI and educational technology.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Education',
      avatar: 'ER',
      description: 'Learning expert dedicated to creating effective course structures.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About CoursFlow
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're on a mission to transform online education by creating an intuitive, 
              AI-powered platform that makes learning accessible, engaging, and effective for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-secondary-main">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-secondary-main dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-neutral-darkGray dark:text-neutral-gray">
                <p>
                  CoursFlow was born from a simple observation: students and educators needed 
                  a better way to manage their learning journey. Traditional platforms were 
                  either too complex or lacked essential features.
                </p>
                <p>
                  Founded in 2023, we set out to create a platform that combines powerful 
                  organization tools with cutting-edge AI technology, making it easier for 
                  everyone to achieve their educational goals.
                </p>
                <p>
                  Today, CoursFlow serves thousands of students and educators worldwide, 
                  helping them streamline their courses, track progress, and enhance learning 
                  with AI-powered assistance.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-primary rounded-2xl p-8 shadow-card-hover">
                <div className="grid grid-cols-2 gap-6 text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">10,000+</div>
                    <div className="text-white/80">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">500+</div>
                    <div className="text-white/80">Instructors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">1,000+</div>
                    <div className="text-white/80">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">95%</div>
                    <div className="text-white/80">Satisfaction</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-offWhite dark:bg-secondary-dark">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary-main dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hover className="h-full">
                    <div className="w-14 h-14 bg-primary-main/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary-main" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-main dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-darkGray dark:text-neutral-gray">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-secondary-main">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary-main dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray">
              Passionate individuals dedicated to transforming education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="w-24 h-24 bg-primary-main rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-main dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-main font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-neutral-darkGray dark:text-neutral-gray text-sm">
                    {member.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
