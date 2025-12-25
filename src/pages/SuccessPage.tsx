import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Mail, 
  ArrowRight,
  Copy,
  PartyPopper,
  MapPin,
  Clock,
  Share2,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';

interface SuccessPageProps {
  order: Order;
  onContinueShopping: () => void;
  onAddToOrder?: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  order,
  onContinueShopping,
  onAddToOrder,
}) => {
  const [copied, setCopied] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    // Calculate estimated delivery (5-7 business days)
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 7);
    setEstimatedDelivery(delivery.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Autopilot Commerce Order',
          text: `Just ordered some amazing products! Order #${order.id}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-shop-bg pt-8 pb-32"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Animation */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-32 h-32 bg-shop-cta rounded-full flex items-center justify-center mx-auto shadow-2xl"
            >
              <CheckCircle2 size={64} className="text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-4 -top-4"
            >
              <PartyPopper size={40} className="text-shop-accent" />
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold tracking-tighter mb-4 uppercase"
          >
            Mission Accomplished!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-shop-text-secondary mb-2"
          >
            Your order has been confirmed and is being processed.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-shop-muted"
          >
            A confirmation email has been sent to <span className="font-bold text-shop-primary">{order.shipping.email}</span>
          </motion.p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl border border-shop-border overflow-hidden mb-8"
        >
          {/* Order Header */}
          <div className="premium-gradient p-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Order Number</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-mono font-bold">{order.id}</p>
                  <button 
                    onClick={copyOrderId}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    title="Copy order ID"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={shareOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-bold"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-8 border-b border-shop-border">
            <h3 className="text-sm font-bold uppercase tracking-widest text-shop-muted mb-6">Order Status</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-shop-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '33%' }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="h-full bg-shop-cta"
                />
              </div>
              
              {[
                { icon: CheckCircle2, label: 'Confirmed', active: true, completed: true },
                { icon: Package, label: 'Processing', active: true, completed: false },
                { icon: Truck, label: 'Shipped', active: false, completed: false },
                { icon: MapPin, label: 'Delivered', active: false, completed: false },
              ].map((step, i) => (
                <div key={step.label} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-shop-cta text-white' : 
                    step.active ? 'bg-shop-primary text-white' : 
                    'bg-shop-border text-shop-muted'
                  }`}>
                    <step.icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${
                    step.active ? 'text-shop-primary' : 'text-shop-muted'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-8 grid md:grid-cols-2 gap-8 border-b border-shop-border">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-shop-muted mb-4 flex items-center gap-2">
                <Clock size={16} /> Estimated Delivery
              </h3>
              <p className="text-2xl font-bold">{estimatedDelivery}</p>
              <p className="text-shop-muted text-sm mt-1">5-7 business days with standard shipping</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-shop-muted mb-4 flex items-center gap-2">
                <MapPin size={16} /> Shipping To
              </h3>
              <p className="font-bold">{order.shipping.firstName} {order.shipping.lastName}</p>
              <p className="text-shop-text-secondary text-sm">
                {order.shipping.address}{order.shipping.apartment && `, ${order.shipping.apartment}`}<br />
                {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-shop-muted mb-6 flex items-center gap-2">
              <Package size={16} /> Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <motion.div 
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex gap-4 p-4 bg-shop-bg rounded-2xl"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-shop-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </motion.div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-8 pt-6 border-t border-shop-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-shop-muted">Subtotal</span>
                <span className="font-mono">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-shop-muted">Shipping</span>
                <span className="font-mono">{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-shop-cta">
                  <span>Discount</span>
                  <span className="font-mono">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-shop-border mt-4">
                <span className="uppercase">Total</span>
                <span className="font-mono">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid sm:grid-cols-2 gap-4 mb-12"
        >
          <button 
            onClick={onContinueShopping}
            className="btn-cta py-5 text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </button>
          <a 
            href={`mailto:${order.shipping.email}`}
            className="flex items-center justify-center gap-3 py-5 border-2 border-shop-border rounded-xl font-bold uppercase tracking-widest hover:bg-shop-bg transition-colors"
          >
            <Mail size={20} />
            View Confirmation Email
          </a>
        </motion.div>

        {/* Upsell Section */}
        {onAddToOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-shop-accent/5 border border-shop-accent/20 rounded-3xl p-8 text-center"
          >
            <h3 className="text-xl font-bold mb-2">🎁 Limited Time Offer</h3>
            <p className="text-shop-text-secondary mb-6">
              Add more items to your order before it ships and get <span className="font-bold text-shop-accent">free shipping</span> on the additions!
            </p>
            <button 
              onClick={onAddToOrder}
              className="inline-flex items-center gap-2 px-8 py-4 bg-shop-accent text-white font-bold uppercase tracking-widest rounded-xl hover:bg-shop-accent/90 transition-colors"
            >
              Add to This Order <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center"
        >
          <p className="text-shop-muted text-sm mb-4">
            Need help with your order? Our support team is ready to assist.
          </p>
          <div className="flex justify-center gap-8">
            <a href="#" className="text-shop-accent font-bold text-sm hover:underline">Contact Support</a>
            <a href="#" className="text-shop-accent font-bold text-sm hover:underline">Track Order</a>
            <a href="#" className="text-shop-accent font-bold text-sm hover:underline">Return Policy</a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

