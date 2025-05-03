import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/newsletter/subscribe', { email: data.email });
      
      toast({
        title: 'Subscription Successful!',
        description: 'Thank you for subscribing to the Zenji newsletter!',
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: 'Subscription Failed',
        description: 'There was an error subscribing to the newsletter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section ref={ref} className="py-16 px-4 md:px-10 bg-jungle-green text-white">
      <motion.div 
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-cinzel text-3xl text-zen-gold mb-4">Stay Connected with Zenji</h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Join our newsletter to receive updates, special offers, and Zenji wisdom!
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row sm:space-x-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow mb-3 sm:mb-0">
                    <FormControl>
                      <Input
                        placeholder="Your email address"
                        {...field}
                        className="px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 focus:outline-none focus:border-zen-gold text-white placeholder-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-left text-xs mt-1" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-zen-gold text-jungle-green px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-8">
          <a 
            href="http://www.instagram.com/playzenji" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-white hover:text-zen-gold transition duration-300"
          >
            <i className="fab fa-instagram text-2xl mr-2"></i> Follow us on Instagram @playzenji
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
