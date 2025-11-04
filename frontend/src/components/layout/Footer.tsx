import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', path: '/#services' },
      { name: 'Courses', path: '/courses' },
      { name: 'Pricing', path: '/#services' },
      { name: 'About', path: '/#about' },
    ],
    company: [
      { name: 'About Us', path: '/#about' },
      { name: 'Contact', path: '/#contact' },
      { name: 'Community', path: '/#community' },
      { name: 'Services', path: '/#services' },
    ],
    resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Help Center', path: '/help' },
      { name: 'Community', path: '/#community' },
      { name: 'Support', path: '/#contact' },
    ],
    legal: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
      { name: 'Cookies', path: '/cookies' },
      { name: 'Licenses', path: '/licenses' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, url: 'mailto:info@coursflow.com' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-secondary-main via-secondary-dark to-secondary-main text-white mt-auto overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-primary-main rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-accent-cyan rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
              <motion.img
                src="/image/CoursFlow_logo.png"
                alt="CoursFlow Logo"
                className="h-14 w-auto drop-shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
                CoursFlow
              </span>
            </Link>
            <p className="text-neutral-gray mb-6 max-w-sm leading-relaxed text-lg">
              Revolutionize your learning experience with AI-powered course management and intelligent scheduling.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-neutral-gray hover:text-primary-light transition-colors"
              >
                <MapPin className="w-5 h-5 text-primary-main" />
                <span>123 Education Street, Learning City</span>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-neutral-gray hover:text-primary-light transition-colors"
              >
                <Phone className="w-5 h-5 text-primary-main" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-neutral-gray hover:text-primary-light transition-colors"
              >
                <Mail className="w-5 h-5 text-primary-main" />
                <span>info@coursflow.com</span>
              </motion.div>
            </div>

            {/* Social Links - Enhanced */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 bg-gradient-to-br from-secondary-light to-secondary-dark rounded-xl flex items-center justify-center hover:from-primary-main hover:to-accent-cyan transition-all duration-300 shadow-lg hover:shadow-primary-main/50"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  {link.path.startsWith('/#') ? (
                    <a
                      href={link.path}
                      className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  {link.path.startsWith('/#') ? (
                    <a
                      href={link.path}
                      className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  {link.path.startsWith('/#') ? (
                    <a
                      href={link.path}
                      className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    to={link.path}
                    className="text-neutral-gray hover:text-primary-light transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-main transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 p-8 bg-gradient-to-r from-primary-main/10 to-accent-cyan/10 rounded-2xl border border-primary-main/20 backdrop-blur-sm"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-neutral-gray mb-6">
              Subscribe to our newsletter for the latest updates, tips, and exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-secondary-light border border-secondary-main focus:border-primary-main focus:outline-none focus:ring-2 focus:ring-primary-main/50 transition-all text-white placeholder-neutral-gray"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary-main to-accent-cyan rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-main/50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Subscribe</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
