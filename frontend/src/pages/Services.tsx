import { motion } from 'framer-motion';
import { BookOpen, Brain, Calendar, Award, Users, TrendingUp, MessageSquare, FileText, Video, Headphones, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Services = () => {
  const mainServices = [
    {
      icon: BookOpen,
      title: 'Course Management',
      description: 'Organize all your courses in one centralized platform with intuitive navigation and smart categorization.',
      features: [
        'Unlimited course creation',
        'Custom categories and tags',
        'Course progress tracking',
        'Resource organization',
      ],
    },
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get personalized assistance with our advanced AI that adapts to your learning style and needs.',
      features: [
        'Automated quiz generation',
        'Instant explanations',
        'Smart recommendations',
        'Personalized study plans',
      ],
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Plan your study sessions efficiently with our intelligent calendar and reminder system.',
      features: [
        'Interactive calendar',
        'Automated reminders',
        'Task prioritization',
        'Deadline tracking',
      ],
    },
    {
      icon: Award,
      title: 'Progress Analytics',
      description: 'Track your learning journey with comprehensive analytics and detailed performance insights.',
      features: [
        'Performance dashboards',
        'Progress visualization',
        'Achievement tracking',
        'Detailed reports',
      ],
    },
    {
      icon: Users,
      title: 'Collaborative Tools',
      description: 'Connect with peers and instructors through integrated communication and collaboration features.',
      features: [
        'Discussion forums',
        'Group projects',
        'Peer reviews',
        'Direct messaging',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your improvement over time with advanced metrics and personalized feedback.',
      features: [
        'Skill assessments',
        'Learning curves',
        'Comparative analytics',
        'Goal tracking',
      ],
    },
  ];

  const additionalServices = [
    {
      icon: MessageSquare,
      title: 'Live Support',
      description: '24/7 customer support to help you with any questions or issues.',
    },
    {
      icon: FileText,
      title: 'Digital Resources',
      description: 'Access to extensive library of study materials and resources.',
    },
    {
      icon: Video,
      title: 'Video Lectures',
      description: 'High-quality video content with interactive features.',
    },
    {
      icon: Headphones,
      title: 'Audio Learning',
      description: 'Learn on the go with audio versions of your courses.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 courses',
        'Basic analytics',
        'Community support',
        'Mobile access',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '19',
      description: 'For serious learners',
      features: [
        'Unlimited courses',
        'AI Assistant',
        'Advanced analytics',
        'Priority support',
        'Offline access',
        'Custom branding',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations',
      features: [
        'Everything in Pro',
        'Team management',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Training sessions',
      ],
      cta: 'Contact Sales',
      highlighted: false,
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
              Our Services
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Comprehensive learning solutions designed to help you achieve your educational goals 
              with cutting-edge technology and expert support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Section */}
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
              Core Features
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray max-w-2xl mx-auto">
              Everything you need for a successful learning experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
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
                      {service.title}
                    </h3>
                    <p className="text-neutral-darkGray dark:text-neutral-gray mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-neutral-darkGray dark:text-neutral-gray">
                          <CheckCircle className="w-4 h-4 text-primary-main mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
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
              Additional Benefits
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray">
              More ways we support your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hover className="text-center h-full">
                    <div className="w-12 h-12 bg-primary-main/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary-main" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-main dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-neutral-darkGray dark:text-neutral-gray">
                      {service.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
              Choose Your Plan
            </h2>
            <p className="text-xl text-neutral-darkGray dark:text-neutral-gray">
              Select the perfect plan for your learning needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={plan.highlighted ? 'md:-mt-4' : ''}
              >
                <Card className={`h-full ${plan.highlighted ? 'border-2 border-primary-main' : ''}`}>
                  {plan.highlighted && (
                    <div className="bg-primary-main text-white text-sm font-semibold py-2 px-4 rounded-lg inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-secondary-main dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-neutral-darkGray dark:text-neutral-gray mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-secondary-main dark:text-white">
                      {plan.price === 'Custom' ? plan.price : `$${plan.price}`}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-neutral-darkGray dark:text-neutral-gray">/month</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-neutral-darkGray dark:text-neutral-gray">
                        <CheckCircle className="w-5 h-5 text-primary-main mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? 'primary' : 'outline'}
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of learners who are already achieving their goals with CoursFlow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="large" className="bg-white text-primary-main hover:bg-neutral-offWhite">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="large" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
