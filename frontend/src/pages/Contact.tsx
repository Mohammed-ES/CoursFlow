import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Réinitialiser le message de succès après 5 secondes
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'support@coursflow.com',
      link: 'mailto:support@coursflow.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Office',
      details: '123 Education Street, Learning City, LC 12345',
      link: '#',
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
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-secondary-main">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hover className="text-center h-full">
                    <div className="w-14 h-14 bg-primary-main/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary-main" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-main dark:text-white mb-2">
                      {info.title}
                    </h3>
                    <a
                      href={info.link}
                      className="text-neutral-darkGray dark:text-neutral-gray hover:text-primary-main transition-colors"
                    >
                      {info.details}
                    </a>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card>
                <h2 className="text-3xl font-bold text-secondary-main dark:text-white mb-6 text-center">
                  Send us a Message
                </h2>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
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
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-lightGray dark:border-secondary-light bg-white dark:bg-secondary-main text-secondary-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main transition-all"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="large"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map or Additional Info Section */}
      <section className="py-20 bg-neutral-offWhite dark:bg-secondary-dark">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-secondary-main dark:text-white mb-6">
              Visit Our Office
            </h2>
            <p className="text-lg text-neutral-darkGray dark:text-neutral-gray mb-8">
              We're located in the heart of the city. Feel free to drop by during business hours 
              (Monday - Friday, 9:00 AM - 6:00 PM) or schedule an appointment.
            </p>
            <div className="bg-neutral-lightGray dark:bg-secondary-main rounded-2xl h-96 flex items-center justify-center">
              <p className="text-neutral-darkGray dark:text-neutral-gray">
                Map Integration Area
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
